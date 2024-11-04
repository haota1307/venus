import { useCallback, useState, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

type RequestType = {
  workspaceId: Id<'workspaces'>;
  body: string;
  options: string[];
};

export const useCreateVote = () => {
  const [data, setData] = useState<Id<'votes'> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'pending' | null>(
    null
  );

  const isPending = useMemo(() => status === 'pending', [status]);
  const isSuccess = useMemo(() => status === 'success', [status]);
  const isError = useMemo(() => status === 'error', [status]);

  const mutation = useMutation(api.votes.createVote);

  const mutate = useCallback(
    async (
      values: RequestType,
      options?: {
        onSuccess?: (data: Id<'votes'>) => void;
        onError?: (error: Error) => void;
      }
    ) => {
      try {
        setData(null);
        setError(null);
        setStatus('pending');

        const response = await mutation(values);
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
