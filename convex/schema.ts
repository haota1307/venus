import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  ...authTables,
  channels: defineTable({
    name: v.string(),
    workspaceId: v.id('workspaces'),
  }).index('by_workspace_id', ['workspaceId']),
  conversations: defineTable({
    memberOneId: v.id('members'),
    memberTwoId: v.id('members'),
    workspaceId: v.id('workspaces'),
  }).index('by_workspace_id', ['workspaceId']),
  members: defineTable({
    role: v.union(v.literal('admin'), v.literal('member')),
    userId: v.id('users'),
    workspaceId: v.id('workspaces'),
  })
    .index('by_user_id', ['userId'])
    .index('by_workspace_id', ['workspaceId'])
    .index('by_workspace_id_user_id', ['workspaceId', 'userId']),
  messages: defineTable({
    body: v.string(),
    channelId: v.optional(v.id('channels')),
    conversationId: v.optional(v.id('conversations')),
    image: v.optional(v.id('_storage')),
    memberId: v.id('members'),
    parentMessageId: v.optional(v.id('messages')),
    updatedAt: v.optional(v.float64()),
    workspaceId: v.id('workspaces'),
  })
    .index('by_channel_id', ['channelId'])
    .index('by_channel_id_parent_message_id_conversation_id', [
      'channelId',
      'parentMessageId',
      'conversationId',
    ])
    .index('by_conversationId', ['conversationId'])
    .index('by_member_id', ['memberId'])
    .index('by_parent_message_id', ['parentMessageId'])
    .index('by_workspace_id', ['workspaceId']),
  reactions: defineTable({
    memberId: v.id('members'),
    messageId: v.id('messages'),
    value: v.string(),
    workspaceId: v.id('workspaces'),
  })
    .index('by_member_id', ['memberId'])
    .index('by_message_id', ['messageId'])
    .index('by_workspace_id', ['workspaceId']),
  users: defineTable({
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.float64()),
  })
    .index('email', ['email'])
    .index('phone', ['phone']),
  workspaces: defineTable({
    joinCode: v.string(),
    name: v.string(),
    userId: v.id('users'),
  }),
});
