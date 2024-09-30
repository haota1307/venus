'use client';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';

const workspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return <div>workspaceId page</div>;
};

export default workspaceIdPage;
