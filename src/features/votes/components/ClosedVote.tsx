import { Users2 } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import VotersTooltip from '@/features/votes/components/VotersTooltip';
import VoteOptionItem from '@/features/votes/components/VoteOptionItem';

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

const ClosedVote = ({ _id, body, _creationTime, options }: Vote) => {
  const totalVotes = options.reduce((acc, option) => acc + option.voteCount, 0);
  const voters = options.flatMap((option) => option.voters);

  return (
    <div className={cn('border rounded-lg p-4')}>
      {/* Poll Header */}
      <div className="flex items-center gap-x-5">
        <div className="inline-flex items-center px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
          <span className="font-medium">Đã kết thúc</span>
        </div>
        <div className="inline-flex items-center gap-x-3 ml-auto">
          <VotersTooltip totalVotes={totalVotes} voters={voters} />
        </div>
      </div>

      {/* Poll Body */}
      <p className="font-bold mt-4">{body}</p>

      {/* Poll Options */}
      <div className="space-y-3 mt-4" role="list">
        {options.map((option) => (
          <VoteOptionItem
            key={option._id}
            option={option}
            isVoted={false}
            totalVoteVotes={totalVotes}
            isVoteClosed={true}
          />
        ))}
      </div>

      {/* Total votes */}
      <p className="text-slate-400 text-sm mt-5 ml-3 inline-flex items-center justify-center">
        <Users2 className="inline-block mr-2" />
        {totalVotes} bình chọn
      </p>
    </div>
  );
};

export default ClosedVote;
