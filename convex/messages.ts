import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, QueryCtx } from './_generated/server';
import { Id } from './_generated/dataModel';

export const getMember = async (ctx: QueryCtx, workspaceId: Id<'workspaces'>, userId: Id<'users'>) => {
  return await ctx.db
    .query('members')
    .withIndex('by_workspace_id_user_id', (q) => q.eq('workspaceId', workspaceId).eq('userId', userId))
    .unique();
};

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id('_storage')),
    workspaceId: v.id('workspaces'),
    channelId: v.optional(v.id('channels')),
    parentMessageId: v.optional(v.id('messages')),
    conversationId: v.optional(v.id('conversations')),
  },
  handler: async (ctx, args) => {
    const { body, image, workspaceId, channelId, parentMessageId, conversationId } = args;

    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Người dùng chưa đăng nhập');

    const member = await getMember(ctx, workspaceId, userId);

    if (!member) throw new Error('Không đủ quyền');

    let _conversationId = conversationId;
    if (!_conversationId && !channelId && parentMessageId) {
      const parentMessage = await ctx.db.get(parentMessageId);

      if (!parentMessage) throw new Error('Không tìm thấy tin nhắn gốc');

      _conversationId = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert('messages', {
      body,
      image,
      memberId: member._id,
      workspaceId,
      channelId,
      conversationId: _conversationId,
      parentMessageId,
    });

    return messageId;
  },
});
