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
      throw new Error('Đang có một bài vote đang diễn ra');
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

export const vote = mutation({
  args: {
    voteId: v.id('votes'),
    optionId: v.id('voteOptions'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Kiểm tra xem người dùng đã bình chọn chưa
    const existingVoteRecord = await ctx.db
      .query('voteRecords')
      .withIndex('by_vote_id_author_id', (q) =>
        q.eq('voteId', args.voteId).eq('authorId', args.userId)
      )
      .unique();

    if (existingVoteRecord) {
      if (existingVoteRecord.voteOptionId === args.optionId) {
        // Nếu người dùng chọn lại option cũ, bỏ chọn (xóa bình chọn)
        await ctx.db.delete(existingVoteRecord._id);
      } else {
        // Nếu người dùng đã bình chọn cho một option khác, xóa option cũ
        await ctx.db.delete(existingVoteRecord._id);

        // Tạo bản ghi mới với option mới
        await ctx.db.insert('voteRecords', {
          voteId: args.voteId,
          voteOptionId: args.optionId,
          authorId: args.userId,
        });
      }
    } else {
      // Nếu chưa có bình chọn, tạo bản ghi bình chọn mới
      await ctx.db.insert('voteRecords', {
        voteId: args.voteId,
        voteOptionId: args.optionId,
        authorId: args.userId,
      });
    }
  },
});

export const deleteVote = mutation({
  args: {
    voteId: v.id('votes'),
  },
  handler: async (ctx, args) => {
    // Kiểm tra xem cuộc bình chọn có tồn tại không
    const vote = await ctx.db.get(args.voteId);
    if (!vote) {
      throw new Error('Cuộc bình chọn không tồn tại');
    }

    // Xóa tất cả các voteOptions và voteRecords liên quan đến vote này
    const options = await ctx.db
      .query('voteOptions')
      .withIndex('by_poll_id', (q) => q.eq('voteId', args.voteId))
      .collect();

    // Xóa từng option và các voteRecords liên quan
    for (const option of options) {
      await ctx.db.delete(option._id);
      const voteRecords = await ctx.db
        .query('voteRecords')
        .withIndex('by_vote_id_option_id', (q) =>
          q.eq('voteId', args.voteId).eq('voteOptionId', option._id)
        )
        .collect();
      for (const record of voteRecords) {
        await ctx.db.delete(record._id);
      }
    }

    // Xóa vote
    await ctx.db.delete(args.voteId);

    return { success: true };
  },
});

export const endVote = mutation({
  args: {
    voteId: v.id('votes'),
  },
  handler: async (ctx, args) => {
    // Kiểm tra xem cuộc bình chọn có tồn tại không
    const vote = await ctx.db.get(args.voteId);
    if (!vote) {
      throw new Error('Cuộc bình chọn không tồn tại');
    }

    // Cập nhật isLive thành false để kết thúc cuộc bình chọn
    await ctx.db.patch(args.voteId, { isLive: false });

    return { success: true };
  },
});
