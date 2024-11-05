import { useCallback, useState, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export const useEndVote = () => {
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'pending' | null>(
    null
  );

  const isPending = useMemo(() => status === 'pending', [status]);
  const isSuccess = useMemo(() => status === 'success', [status]);
  const isError = useMemo(() => status === 'error', [status]);

  const mutation = useMutation(api.votes.endVote);

  const mutate = useCallback(
    async (
      voteId: Id<'votes'>,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void }
    ) => {
      try {
        setError(null);
        setStatus('pending');

        await mutation({ voteId });
        setStatus('success');
        options?.onSuccess?.();
      } catch (error) {
        setStatus('error');
        setError(error as Error);
        options?.onError?.(error as Error);
      }
    },
    [mutation]
  );

  return {
    mutate,
    error,
    isPending,
    isSuccess,
    isError,
  };
};
