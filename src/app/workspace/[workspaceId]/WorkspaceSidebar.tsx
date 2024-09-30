import WorkspaceHeader from '@/app/workspace/[workspaceId]/WorkspaceHeader';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { AlertTriangle, Loader } from 'lucide-react';

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-2 h-full items-center justify-center">
        <AlertTriangle className="size-8 animate-bounce text-fuchsia-500" />
        <p className="text-white text-sm">Workspace không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <WorkspaceHeader workspace={workspace} isAdmin={member.role === 'admin'} />
    </div>
  );
};

export default WorkspaceSidebar;
