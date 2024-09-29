import { useParams } from 'next/navigation';
import { Id } from '../../convex/_generated/dataModel';

export const useWorkspaceId = () => {
  const params = useParams<{ workspaceId: string }>();

  return params.workspaceId as Id<'workspaces'>;
};
