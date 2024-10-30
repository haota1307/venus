import { v } from 'convex/values';
import { query } from './_generated/server';
import { mutation } from './_generated/server';

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getMetadata = query({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.system.get(args.storageId);
  },
});
