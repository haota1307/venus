import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  authAccounts: defineTable({
    provider: v.string(),
    providerAccountId: v.string(),
    secret: v.optional(v.string()),
    userId: v.id('users'),
  })
    .index('providerAndAccountId', ['provider', 'providerAccountId'])
    .index('userIdAndProvider', ['userId', 'provider']),

  authRefreshTokens: defineTable({
    expirationTime: v.float64(),
    sessionId: v.id('authSessions'),
  }).index('sessionId', ['sessionId']),

  authSessions: defineTable({
    expirationTime: v.float64(),
    userId: v.id('users'),
  }).index('userId', ['userId']),

  authVerificationCodes: defineTable({
    accountId: v.id('authAccounts'),
    code: v.string(),
    emailVerified: v.optional(v.string()),
    expirationTime: v.float64(),
    phoneVerified: v.optional(v.string()),
    provider: v.string(),
    verifier: v.optional(v.string()),
  })
    .index('accountId', ['accountId'])
    .index('code', ['code']),

  authVerifiers: defineTable({
    sessionId: v.optional(v.id('authSessions')),
    signature: v.optional(v.string()),
  }).index('signature', ['signature']),

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
    name: v.optional(v.string()),
  }).index('email', ['email']),

  workspaces: defineTable({
    joinCode: v.string(),
    name: v.string(),
    userId: v.id('users'),
  }),

  votes: defineTable({
    workspaceId: v.id('workspaces'),
    body: v.string(),
    isLive: v.boolean(),
    ownerId: v.id('members'),
  })
    .index('by_workspace_id', ['workspaceId'])
    .index('by_workspace_id_is_live', ['workspaceId', 'isLive']),

  voteOptions: defineTable({
    index: v.number(),
    body: v.string(),
    voteId: v.id('votes'),
  })
    .index('by_poll_id', ['voteId'])
    .index('by_poll_id_index', ['voteId', 'index']),

  voteRecords: defineTable({
    authorId: v.id('users'),
    voteId: v.id('votes'),
    voteOptionId: v.id('voteOptions'),
  }).index('by_vote_id_author_id', ['voteId', 'authorId']),
});
