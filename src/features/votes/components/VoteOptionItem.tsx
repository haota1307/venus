import { cn } from '@/lib/utils';
import { Circle, CircleCheckBig } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';

interface VoteOption {
  _creationTime: number;
  _id: Id<'voteOptions'>; // Đảm bảo sử dụng Id cho option
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

interface VoteOptionItemProps {
  option: VoteOption;
  isVoted: boolean;
  totalVoteVotes: number;
  isVoteClosed: boolean;
  onVoteChange?: (optionId: Id<'voteOptions'>) => void;
}

const VoteOptionItem = ({
  isVoteClosed,
  isVoted,
  onVoteChange: handleVoteChange,
  option,
  totalVoteVotes,
}: VoteOptionItemProps) => {
  // Tính tỷ lệ phiếu cho tùy chọn
  const percentage =
    totalVoteVotes > 0 ? (option.voteCount / totalVoteVotes) * 100 : 0;

  return (
    <button
      role="listitem"
      onClick={() => handleVoteChange?.(option._id)}
      disabled={isVoteClosed}
      className={cn(
        'relative text-sm flex w-full justify-between border p-4 rounded-sm disabled:cursor-not-allowed disabled:opacity-70',
        isVoted && 'ring-violet-300 ring-2 ring-opacity-80'
      )}
    >
      <div className="inline-flex items-center gap-x-2">
        {isVoted ? (
          <CircleCheckBig className="stroke-violet-700" size={20} />
        ) : (
          <Circle className="stroke-gray-500" size={20} />
        )}
        <p className="font-medium">{option.body}</p>
      </div>

      <p className="font-medium">{option.voteCount} Bình chọn</p>

      {/* Overlay of the amount of votes */}
      <div
        aria-hidden
        className="absolute inset-0 bg-violet-300/30 rounded-sm transition-all duration-300"
        style={{ width: `${percentage}%` }} // Sửa lại để sử dụng kiểu chuỗi đúng
      />
    </button>
  );
};

export default VoteOptionItem;
