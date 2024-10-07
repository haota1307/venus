import dynamic from 'next/dynamic';

import { format, isToday, isYesterday } from 'date-fns';
import { Doc, Id } from '../../convex/_generated/dataModel';

import { Hint } from '@/components/hint';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { vi } from 'date-fns/locale';
import Thumbnail from '@/components/Thumbnail';
import { Toolbar } from '@/components/Toolbar';

const Renderer = dynamic(() => import('@/components/Renderer'));

const formatFullTime = (date: Date) =>
  `${isToday(date) ? 'Hôm nay, ' : isYesterday(date) ? 'Hôm qua, ' : format(date, 'd MMM, yyyy')} lúc ${format(date, 'h:mm:ss a')}`;

interface MessageProps {
  id: Id<'messages'>;
  memberId: Id<'members'>;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number;
      memberIds: Id<'members'>[];
    }
  >;
  body: Doc<'messages'>['body'];
  image: string | null | undefined;
  createdAt: Doc<'messages'>['_creationTime'];
  updatedAt: Doc<'messages'>['updatedAt'];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<'messages'> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
}

const Message = ({
  id,
  memberId,
  authorImage,
  authorName = 'Member',
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  if (isCompact) {
    return (
      <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
        <div className="flex items-center gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
              {format(new Date(createdAt), 'hh:mm')}
            </button>
          </Hint>
          <div className="flex flex-col ">
            <div className="flex-1 w-6" />
            <Renderer value={body} />
            {updatedAt && <span className="text-xs text-muted-foreground">(đã chỉnh sửa)</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
      <div className="flex items-start gap-2">
        <button>
          <Avatar className="rounded-md">
            <AvatarImage className="rounded-md" src={authorImage} />
            <AvatarFallback className="rounded-md bg-fuchsia-700 text-white text-xs">
              {authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-sm">
            <button className="font-bold text-primary hover:underline">{authorName}</button>
            <span>&nbsp;&nbsp;</span>

            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground hover:underline">
                {format(new Date(createdAt), 'h:mm a', { locale: vi })}
              </button>
            </Hint>
          </div>
          <div className="flex flex-col w-full">
            <Renderer value={body} />

            <Thumbnail url={image} />

            {updatedAt && <span className="text-xs text-muted-foreground">(đã chỉnh sửa)</span>}
          </div>
        </div>
      </div>

      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={false}
          handleEdit={() => setEditingId(id)}
          handleThread={() => {}}
          handleDelete={() => {}}
          handleReaction={() => {}}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
};

export default Message;
