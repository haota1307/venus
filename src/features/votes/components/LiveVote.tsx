import { PauseCircle, Radio, Users2 } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import VoteOptionItem from '@/features/votes/components/VoteOptionItem';
import VotersTooltip from '@/features/votes/components/VotersTooltip';
import PollOptionsMenu from '@/features/votes/components/VoteOptionMenu';

interface VoteOption {
  _creationTime: number;
  _id: Id<'voteOptions'>; // Sử dụng Id cho các tùy chọn
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
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const totalVotes = options.reduce((acc, option) => acc + option.voteCount, 0);
  const voters = options.flatMap((option) => option.voters);
  const showEndButton = true; // Bạn có thể thay đổi điều kiện để hiện nút này nếu cần
  const votedOptionIndex = -1; // Thay đổi logic này nếu bạn cần lưu trữ chỉ số tùy chọn đã được bỏ phiếu
  const poll = { id: _id, body };

  const voteOption = (index: number) => {
    // Logic xử lý bỏ phiếu ở đây
    console.log(`Voted for option index: ${index}`);
  };

  return (
    <>
      <div className={cn('border rounded-lg p-4')}>
        <div className="flex items-center gap-x-5">
          {/* Live badge */}
          {isLive && (
            <div className="inline-flex items-center px-2 py-1 bg-green-100 text-gray-700 text-xs rounded-full">
              <Radio className="size-4 animate-pulse fill-green-500 mr-2" />
              <span className="font-medium">Đang diễn ra</span>
            </div>
          )}

          {/* End button */}
          {showEndButton && (
            <Button
              size={'sm'}
              variant={'destructive'}
              onClick={() => setOpenCloseDialog(true)}
            >
              <PauseCircle className="size-4 mr-2" />
              <span>Kết thúc</span>
            </Button>
          )}

          <div className="inline-flex items-center gap-x-3 ml-auto">
            <VotersTooltip totalVotes={totalVotes} voters={voters} />
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
          </div>
        </div>

        {/* Poll body */}
        <p className="font-bold mt-4">{body}</p>

        {/* Poll options */}
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

        {/* Total votes */}
        <p className="text-slate-400 text-sm mt-5 ml-3 inline-flex items-center justify-center">
          <Users2 className="inline-block mr-2" />
          {totalVotes} bình chọn
        </p>
      </div>

      {/* Close poll dialog (commented out for now) */}
      {/* <ClosePollDialog
        pollId={poll.id}
        open={openCloseDialog}
        onOpenChange={setOpenCloseDialog}
        onSuccess={() => setOpenCloseDialog(false)}
      /> */}
    </>
  );
};

export default LiveVote;
