'use client';

import { notFound } from 'next/navigation';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useCurrentUser } from '@/features/auth/api/useCurrentUser';
import { useGetVotesByWorkspaceId } from '@/features/votes/api/useGetVotesByWorkspaceId';
import { Loader } from 'lucide-react';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';

const VotesPage = () => {
  const workspaceId = useWorkspaceId();

  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: votes, isLoading: votesLoading } = useGetVotesByWorkspaceId({
    workspaceId,
  });

  const isLoading = userLoading || votesLoading;

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b h-[49px] flex items-center px-4 overflow-hidden">
        Cuộc bình chọn - {workspace?.name}
      </div>
    </div>
  );
};

export default VotesPage;
