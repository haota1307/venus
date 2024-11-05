import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const createVote = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    ownerId: v.id('users'),
    body: v.string(),
    options: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Người dùng chưa đăng nhập');

    const currentMember = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!currentMember) {
      return null;
    }

    const existingLiveVote = await ctx.db
      .query('votes')
      .withIndex('by_workspace_id_is_live', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('isLive', true)
      )
      .unique();

    if (existingLiveVote) {
      return;
    }

    // Tạo cuộc bình chọn mới
    const voteId = await ctx.db.insert('votes', {
      workspaceId: args.workspaceId,
      ownerId: args.ownerId,
      body: args.body,
      isLive: true,
    });

    // Thêm các tùy chọn cho bình chọn
    const optionsData = args.options.map((option, index) => ({
      voteId,
      body: option,
      index,
    }));

    await Promise.all(
      optionsData.map((option) => ctx.db.insert('voteOptions', option))
    );

    return voteId;
  },
});

export const votePollOption = mutation({
  args: {
    voteId: v.id('votes'),
    optionId: v.id('voteOptions'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Người dùng chưa đăng nhập');

    // Kiểm tra xem bình chọn đã tồn tại chưa
    const existingVote = await ctx.db
      .query('voteRecords')
      .withIndex('by_vote_id_author_id', (q) =>
        q.eq('voteId', args.voteId).eq('authorId', userId)
      )
      .unique();

    // Nếu đã bình chọn, cập nhật lại bình chọn
    if (existingVote) {
      if (existingVote.voteOptionId === args.optionId) {
        return;
      }
      // Cập nhật bình chọn
      await ctx.db.patch(existingVote._id, { voteOptionId: args.optionId });

      // // Cập nhật số lượng bình chọn cho tùy chọn
      // await ctx.db.patch(args.optionId, {
      //   _count: {
      //     votes: ctx.db.patch(args.optionId, { _count: { votes: 1 } }),
      //   },
      // });

      // // Giảm số lượng bình chọn cho tùy chọn cũ
      // await ctx.db.patch(existingVote.optionId, {
      //   _count: {
      //     votes: ctx.db.patch(existingVote.optionId, { _count: { votes: -1 } }),
      //   },
      // });
    }
    //  else {
    //   // Nếu chưa bình chọn, thêm bình chọn mới
    //   await ctx.db.insert('votes', {
    //     pollId: args.pollId,
    //     userId,
    //     optionId: args.optionId,
    //   });

    //   // Tăng số lượng bình chọn cho tùy chọn
    //   await ctx.db.patch(args.optionId, {
    //     _count: {
    //       votes: ctx.db.patch(args.optionId, { _count: { votes: 1 } }),
    //     },
    //   });
    // }
  },
});

export const getVotesByWorkspaceId = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query('votes')
      .withIndex('by_workspace_id', (q) =>
        q.eq('workspaceId', args.workspaceId)
      )
      .collect();

    return votes;
  },
});
