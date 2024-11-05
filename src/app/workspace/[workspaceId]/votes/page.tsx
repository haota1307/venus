'use client';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useCurrentUser } from '@/features/auth/api/useCurrentUser';
import { useGetVotesByWorkspaceId } from '@/features/votes/api/useGetVotesByWorkspaceId';
import { Loader } from 'lucide-react';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import LiveVote from '@/features/votes/components/LiveVote';

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

  return (
    <div className="flex flex-col h-full">
      <div className="border-b h-[49px] flex items-center px-4 overflow-hidden">
        Cuộc bình chọn - {workspace?.name}
      </div>

      <div className="flex flex-col gap-6 p-4">
        {votes && votes.length > 0 ? (
          votes.map((vote) => (
            <div key={vote._id}>
              {vote.isLive ? (
                <LiveVote
                  _id={vote._id}
                  _creationTime={vote._creationTime}
                  workspaceId={vote.workspaceId}
                  ownerId={vote.ownerId}
                  body={vote.body}
                  options={vote.options}
                  isLive={vote.isLive}
                  key={vote._id}
                />
              ) : (
                <div>{JSON.stringify(vote)}</div>

                // <ClosedPoll poll={poll} />
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
