import React from 'react';
import dynamic from 'next/dynamic';

import { format, isToday, isYesterday } from 'date-fns';
import { Doc, Id } from '../../convex/_generated/dataModel';

import { cn } from '@/lib/utils';
import { vi } from 'date-fns/locale';

import { useUpdateMessage } from '@/features/messages/api/useUpdateMessage';
import { useRemoveMessage } from '@/features/messages/api/useRemoveMessage';
import { useToggleReaction } from '@/features/reactions/api/useToggleReaction';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Hint } from '@/components/hint';
import { Toolbar } from '@/components/Toolbar';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/useConfirm';
import Thumbnail from '@/components/Thumbnail';
import Reactions from '@/components/Reactions';

const Renderer = dynamic(() => import('@/components/Renderer'), { ssr: false });
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

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
  const [ConfirmDialog, confirm] = useConfirm(
    'Xóa tin nhắn',
    'Bạn có chắc muốn xóa tin nhắn, tin nhắn sau khi xóa không thể hoàn tác'
  );

  const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage();
  const { mutate: toggleReaction, isPending: istogglingReaction } = useToggleReaction();

  const isPending = isUpdatingMessage || isRemovingMessage;

  const handleCreation = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error('Không thể thả biểu tượng cảm súc');
        },
      }
    );
  };

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { body, id },
      {
        onSuccess: () => {
          toast.success('Tin nhắn đã được chỉnh sửa');
          setEditingId(null);
        },
        onError: () => {
          toast.error('Chỉnh sửa tin nhắn thất bại');
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success('Tin nhắn đã được xóa');
        },
        onError: () => {
          toast.error('Xóa tin nhắn thất bại');
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
            isEditing && 'bg-yellow-500 hover:bg-yellow-50',
            isRemovingMessage && 'transform transition-all scale-y-0 origin-bottom duration-200'
          )}
        >
          <div className="flex items-center gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), 'hh:mm')}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disable={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col ">
                <div className="flex-1 w-6" />

                <Renderer value={body} />

                {updatedAt && <span className="text-xs text-muted-foreground">(đã chỉnh sửa)</span>}

                <Reactions data={reactions} onChange={handleCreation} />
              </div>
            )}
            {!isEditing && (
              <Toolbar
                isAuthor={isAuthor}
                isPending={isPending}
                handleEdit={() => setEditingId(id)}
                handleThread={() => {}}
                handleDelete={handleDelete}
                handleReaction={handleCreation}
                hideThreadButton={hideThreadButton}
              />
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
          isEditing && 'bg-yellow-100/70 hover:bg-yellow-100/70',
          isRemovingMessage && 'bg-rose-100 transform transition-all scale-y-0 origin-bottom duration-200'
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar className="rounded-md">
              <AvatarImage className="rounded-md" src={authorImage} />
              <AvatarFallback className="rounded-md bg-fuchsia-700 text-white text-xs">
                {authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>

          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disable={isUpdatingMessage}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
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

                <Reactions data={reactions} onChange={handleCreation} />
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleDelete={handleDelete}
            handleReaction={handleCreation}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};

export default Message;
