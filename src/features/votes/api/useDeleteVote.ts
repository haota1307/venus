import { useCallback, useState, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type RequestType = {
  voteId: Id<'votes'>;
};

export const useDeleteVote = () => {
  const [data, setData] = useState<null | string>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'pending' | null>(
    null
  );

  const isPending = useMemo(() => status === 'pending', [status]);
  const isSuccess = useMemo(() => status === 'success', [status]);
  const isError = useMemo(() => status === 'error', [status]);

  const mutation = useMutation(api.votes.deleteVote);

  const mutate = useCallback(
    async (
      values: RequestType,
      options?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
      }
    ) => {
      try {
        setData(null);
        setError(null);
        setStatus('pending');

        await mutation(values);
        setData('Vote deleted successfully');
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
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};
