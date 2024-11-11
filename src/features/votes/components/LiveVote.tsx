import { PauseCircle, Radio, Users2, Trash2 } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import VoteOptionItem from '@/features/votes/components/VoteOptionItem';
import VotersTooltip from '@/features/votes/components/VotersTooltip';
import PollOptionsMenu from '@/features/votes/components/VoteOptionMenu';
import { useVote } from '@/features/votes/api/useVote';
import { useCurrentUser } from '@/features/auth/api/useCurrentUser';
import { useConfirm } from '@/hooks/useConfirm';
import { useEndVote } from '@/features/votes/api/useEndVote';

interface VoteOption {
  _creationTime: number;
  _id: Id<'voteOptions'>;
  body: string;
  voteCount: number;
  voters: {
    _id: Id<'users'>;
    _creationTime: number;
    name?: string;
    image?: string;
    email?: string;
    emailVerificationTime?: number;
  }[];
}

interface Vote {
  _id: Id<'votes'>;
  _creationTime: number;
  workspaceId: Id<'workspaces'>;
  body: string;
  isLive: boolean;
  ownerId: Id<'users'>;
  options: VoteOption[];
}

const LiveVote = ({
  _id,
  body,
  isLive,
  _creationTime,
  options,
  ownerId,
  workspaceId,
}: Vote) => {
  const user = useCurrentUser();

  const [votedOptionIndex, setVotedOptionIndex] = useState<number | null>(null);
  const totalVotes = options.reduce((acc, option) => acc + option.voteCount, 0);
  const voters = options.flatMap((option) => option.voters);

  const isOwner = ownerId === user.data?._id;

  useEffect(() => {
    const votedIndex = options.findIndex((option) =>
      option.voters.some((voter) => voter._id === user.data?._id)
    );
    if (votedIndex !== -1) {
      setVotedOptionIndex(votedIndex);
    }
  }, [options, user]);

  const [ConfirmDialog, confirm] = useConfirm(
    'Bạn có chắc muốn kết thúc cuộc bình chọn không?',
    'Điều này sẽ vô hiệu hóa cuộc bình chọn và sẽ không ai có thể thay đổi sự lựa chọn.'
  );

  const { mutate: vote, isPending } = useVote();
  const { mutate: endVote } = useEndVote();

  const voteOption = (index: number) => {
    const option = options[index]._id;
    if (!isLive || isPending) return;

    if (votedOptionIndex === index) {
      vote(
        {
          voteId: _id,
          voteOptionId: option,
          userId: user.data?._id!,
        },
        {
          onSuccess: () => {
            setVotedOptionIndex(null);
          },
          onError: (error) => {
            console.error('Error unvoting:', error);
          },
        }
      );
    } else {
      vote(
        {
          voteId: _id,
          voteOptionId: option,
          userId: user.data?._id!,
        },
        {
          onSuccess: () => {
            setVotedOptionIndex(index);
          },
          onError: (error) => {
            console.error('Error voting:', error);
          },
        }
      );
    }
  };

  const handleEndVote = async () => {
    const ok = await confirm();
    if (ok) {
      await endVote(_id);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className={cn('border rounded-lg p-4')}>
        <div className="flex items-center gap-x-5">
          {isLive && (
            <div className="inline-flex items-center px-2 py-1 bg-green-100 text-gray-700 text-xs rounded-full">
              <Radio className="size-4 animate-pulse fill-green-500 mr-2" />
              <span className="font-medium">Đang diễn ra</span>
            </div>
          )}

          {isOwner && (
            <>
              <Button
                size={'sm'}
                variant={'destructive'}
                onClick={handleEndVote}
              >
                <PauseCircle className="size-4 mr-2" />
                <span>Kết thúc</span>
              </Button>
            </>
          )}

          <div className="inline-flex items-center gap-x-3 ml-auto">
            <VotersTooltip totalVotes={totalVotes} voters={voters} />
            {isOwner && (
              <PollOptionsMenu
                vote={{
                  _creationTime,
                  _id,
                  body,
                  isLive,
                  options,
                  ownerId,
                  workspaceId,
                }}
              />
            )}
          </div>
        </div>

        <p className="font-bold mt-4">{body}</p>

        <div className="space-y-3 mt-4" role="list">
          {options.map((option, index) => (
            <VoteOptionItem
              key={option._id}
              option={option}
              isVoted={index === votedOptionIndex}
              totalVoteVotes={totalVotes}
              isVoteClosed={!isLive}
              onVoteChange={() => voteOption(index)}
            />
          ))}
        </div>

        <p className="text-slate-400 text-sm mt-5 ml-3 inline-flex items-center justify-center">
          <Users2 className="inline-block mr-2" />
          {totalVotes} bình chọn
        </p>
      </div>
    </>
  );
};

export default LiveVote;
