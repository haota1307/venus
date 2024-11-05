'use client';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useCurrentUser } from '@/features/auth/api/useCurrentUser';
import { useGetVotesByWorkspaceId } from '@/features/votes/api/useGetVotesByWorkspaceId';
import { Loader } from 'lucide-react';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import LiveVote from '@/features/votes/components/LiveVote';
import ClosedVote from '@/features/votes/components/ClosedVote';
import { Separator } from '@/components/ui/separator';

const VotesPage = () => {
  const workspaceId = useWorkspaceId();

  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: votes, isLoading: votesLoading } = useGetVotesByWorkspaceId({
    workspaceId,
  });

  const isLoading = userLoading || votesLoading || workspaceLoading;

  console.log({ votes });

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 text-muted-foreground animate-spin" />
      </div>
    );
  }

  // Sắp xếp votes: Live votes trước, Closed votes sau
  const sortedVotes = votes?.sort((a, b) =>
    a.isLive === b.isLive ? 0 : a.isLive ? -1 : 1
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto messages-scrollbar">
      <div className="border-b h-[49px] flex items-center px-4 overflow-hidden">
        Cuộc bình chọn - {workspace?.name}
      </div>

      <div className="flex flex-col gap-6 p-4">
        {sortedVotes && sortedVotes.length > 0 ? (
          sortedVotes.map((vote, index) => (
            <div key={vote._id}>
              {vote.isLive ? (
                <LiveVote {...vote} key={vote._id} />
              ) : (
                <ClosedVote key={vote._id} {...vote} />
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            Không có cuộc bình chọn nào
          </p>
        )}
      </div>
    </div>
  );
};

export default VotesPage;
