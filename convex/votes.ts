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
    // Lấy tất cả các vote trong workspace
    const votes = await ctx.db
      .query('votes')
      .withIndex('by_workspace_id', (q) =>
        q.eq('workspaceId', args.workspaceId)
      )
      .collect();

    // Duyệt qua từng vote và lấy thêm thông tin vote options, số lượng bình chọn và thông tin người dùng
    const votesWithDetails = await Promise.all(
      votes.map(async (vote) => {
        // Lấy các option của từng vote
        const options = await ctx.db
          .query('voteOptions')
          .withIndex('by_poll_id', (q) => q.eq('voteId', vote._id))
          .collect();

        // Duyệt qua từng option để đếm số người bình chọn và lấy thông tin người dùng
        const optionsWithCounts = await Promise.all(
          options.map(async (option) => {
            // Lấy danh sách voteRecords cho option này
            const voteRecords = await ctx.db
              .query('voteRecords')
              .withIndex('by_vote_id_option_id', (q) =>
                q.eq('voteId', vote._id).eq('voteOptionId', option._id)
              )
              .collect();

            // Lấy thông tin người dùng cho mỗi voteRecord
            const voters = await Promise.all(
              voteRecords.map(async (record) => {
                const user = await ctx.db.get(record.authorId);
                return user;
              })
            );

            return {
              ...option,
              voteCount: voteRecords.length,
              voters: voters.filter(
                (user): user is NonNullable<typeof user> => user !== null
              ),
            };
          })
        );

        return {
          ...vote,
          options: optionsWithCounts,
        };
      })
    );

    return votesWithDetails;
  },
});
