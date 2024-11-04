import { useQuery } from 'convex/react';

import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

interface useGetVotesByWorkspaceIdProps {
  workspaceId: Id<'workspaces'>;
}

export const useGetVotesByWorkspaceId = ({
  workspaceId,
}: useGetVotesByWorkspaceIdProps) => {
  const data = useQuery(api.votes.getVotesByWorkspaceId, { workspaceId });

  const isLoading = data === undefined;
  return { data, isLoading };
};
