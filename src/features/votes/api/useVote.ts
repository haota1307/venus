import { useCallback, useState, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type VoteRequestType = {
  voteId: Id<'votes'>;
  voteOptionId: Id<'voteOptions'>;
  userId: Id<'users'>;
};

export const useVote = () => {
  const [data, setData] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'pending' | null>(
    null
  );

  const isPending = useMemo(() => status === 'pending', [status]);
  const isSuccess = useMemo(() => status === 'success', [status]);
  const isError = useMemo(() => status === 'error', [status]);

  const mutation = useMutation(api.votes.vote);

  const mutate = useCallback(
    async (
      values: VoteRequestType,
      options?: {
        onSuccess?: (data: { success: boolean; message: string }) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      try {
        setData(null);
        setError(null);
        setStatus('pending');

        const response = await mutation({
          userId: values.userId,
          voteId: values.voteId,
          optionId: values.voteOptionId,
        });
        setData(response);
        setStatus('success');
        options?.onSuccess?.(response!);
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
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};
