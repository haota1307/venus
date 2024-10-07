import { MdOutlineAddReaction } from 'react-icons/md';

import { cn } from '@/lib/utils';

import { Hint } from './hint';
import { Doc, Id } from '../../convex/_generated/dataModel';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { EmojiPopover } from '@/components/EmojiPopover';

interface ReactionsProps {
  data: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number;
      memberIds: Id<'members'>[];
    }
  >;
  onChange: (value: string) => void;
}

const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) return null;

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map((reaction) => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? 'người' : 'người'} thả biểu tượng cảm xúc với ${reaction.value}`}
        >
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              'h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1',
              reaction.memberIds.includes(currentMemberId) && 'bg-fuchsia-100 border-fuchsia-200/80 text-white'
            )}
          >
            {reaction.value}
            <span
              className={cn(
                'text-xs font-semibold text-muted-foreground',
                reaction.memberIds.includes(currentMemberId) && 'text-fuchsia-800'
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover hint="Thả biểu tượng cảm xúc" onEmojiSelect={(emoji) => onChange(emoji.native)}>
        <button className="flex items-center gap-x-1 h-7 px-3 rounded-full bg-slate-100 border border-transparent hover:border-slate-200 text-slate-600">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};

export default Reactions;
