'use client';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';

const workspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return <div>ID: {JSON.stringify(data)}</div>;
};

export default workspaceIdPage;
