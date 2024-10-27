import { usePaginatedQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BATCH_SIZE = 20;

interface UseGetMessagesProps {
  channelId?: Id<'channels'>;
  conversationId?: Id<'conversations'>;
  parentMessageId?: Id<'messages'>;
}

export type GetMessagesReturnType =
  (typeof api.messages.get._returnType)['page'];

export const useGetMessages = ({
  channelId,
  conversationId,
  parentMessageId,
}: UseGetMessagesProps) => {
  const router = useRouter();

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channelId, conversationId, parentMessageId },
    { initialNumItems: BATCH_SIZE }
  );

  useEffect(() => {
    if (!results) {
      router.push('/');
    }
  }, [results, status, router]);

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
