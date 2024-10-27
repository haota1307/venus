'use client';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useGetChannels } from '@/features/channels/api/useGetChannels';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateChannelModal } from '@/features/channels/store/useCreateChannelModal';
import { Loader, TriangleAlert } from 'lucide-react';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';

const WorkspaceIdPage = () => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const [opne, setOpen] = useCreateChannelModal();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role]);

  useEffect(() => {
    const loading = [workspaceLoading, channelsLoading, memberLoading].some(
      Boolean
    );

    if (loading || !workspace || !member) return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    workspaceLoading,
    channelsLoading,
    workspace,
    open,
    setOpen,
    router,
    workspaceId,
    member,
    memberLoading,
    isAdmin,
  ]);

  if (workspaceLoading || channelsLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2 dark:bg-slate-800/60">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace không tồn tại
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2 dark:bg-slate-800/60">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        Kênh chat không tồn tại
      </span>
    </div>
  );
};

export default WorkspaceIdPage;
