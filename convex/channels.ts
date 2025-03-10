import { v } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';

import { mutation, query } from './_generated/server';

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return [];

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member) return [];

    const channels = await ctx.db
      .query('channels')
      .withIndex('by_workspace_id', (q) =>
        q.eq('workspaceId', args.workspaceId)
      )
      .collect();

    return channels;
  },
});

export const getById = query({
  args: { id: v.id('channels') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const channel = await ctx.db.get(args.id);

    if (!channel) return null;

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', channel.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member) return null;

    return channel;
  },
});

export const create = mutation({
  args: { name: v.string(), workspaceId: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error('Không có quyền');

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member || member.role !== 'admin') throw new Error('Không có quyền');

    const channelId = await ctx.db.insert('channels', {
      name: args.name,
      workspaceId: args.workspaceId,
    });

    return channelId;
  },
});

export const update = mutation({
  args: {
    id: v.id('channels'),
    name: v.string(),
  },
  handler: async (ctx, { id, name }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error('Không có quyền');

    const channel = await ctx.db.get(id);
    if (!channel) throw new Error('Không tìm thấy kênh');

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', channel.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member || member.role !== 'admin') throw new Error('Không có quyền');

    await ctx.db.patch(id, {
      name,
    });

    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id('channels'),
  },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error('Không có quyền');

    const channel = await ctx.db.get(id);
    if (!channel) throw new Error('Không tìm thấy kênh');

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', channel.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member || member.role !== 'admin') throw new Error('Không có quyền');

    const [messages] = await Promise.all([
      ctx.db
        .query('messages')
        .withIndex('by_channel_id', (q) => q.eq('channelId', id))
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    await ctx.db.delete(id);

    return id;
  },
});
