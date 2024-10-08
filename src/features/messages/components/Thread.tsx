import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import { Id } from '../../../../convex/_generated/dataModel';
import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';

import Quill from 'quill';
import Message from '@/components/Message';
import { toast } from 'sonner';
import { AlertTriangle, Loader, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useGetMessage } from '@/features/messages/api/useGetMessage';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useGenerateUploadUrl } from '@/features/upload/api/useGenerateUploadUrl';
import { useCreateMessage } from '@/features/messages/api/useCreateMessage';
import { useGetMessages } from '@/features/messages/api/useGetMessages';
import { useChannelId } from '@/hooks/useChannelId';
import { vi } from 'date-fns/locale';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

const TIME_THRESHOLD = 5;

interface ThreadProps {
  messageId: Id<'messages'>;
  onClose: () => void;
}

type CreateMessageValues = {
  channelId: Id<'channels'>;
  workspaceId: Id<'workspaces'>;
  parentMessageId: Id<'messages'>;
  body: string;
  image: Id<'_storage'> | undefined;
};

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);

  if (isToday(date)) return 'Hôm nay';

  if (isYesterday(date)) return 'Hôm qua';

  return format(dateStr, 'EEEE, d MMMM', { locale: vi });
};

const Thread = ({ messageId, onClose }: ThreadProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIspending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createMessage } = useCreateMessage();

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: loadingMessage } = useGetMessage({ id: messageId });
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === 'CanLoadMore';
  const isLoadingMore = status === 'LoadingMore';

  const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
    try {
      setIspending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        channelId,
        parentMessageId: messageId,
        image: undefined,
        workspaceId,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error('URL hình ảnh không tồn tại');
        }

        const result = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error('Upload hình ảnh thất bại');
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, { throwError: true });

      setEditorKey((prevKey) => prevKey + 1); // Giúp sau khi gửi tin nhắn thì ô soạn tin nhắn sẽ được reset
    } catch (error) {
      toast.error('Gửi tin nhắn thất bại!');
    } finally {
      setIspending(false);
      editorRef?.current?.enable(true);
    }
  };

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, 'MM-dd-yyyy');

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof results>
  );

  if (loadingMessage || status === 'LoadingFirstPage') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Trả lời tin nhắn</p>
          <Button onClick={onClose} size={'iconSm'} variant={'ghost'} className="mt-4">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex items-center justify-center h-full mt-4">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Trả lời tin nhắn</p>
          <Button onClick={onClose} size={'iconSm'} variant={'ghost'} className="mt-4">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex items-center justify-center h-full">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p>Tin nhắn không còn tồn tại!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 h-[49px] border-b">
        <p className="text-lg font-bold">Trả lời tin nhắn</p>
        <Button onClick={onClose} size={'iconSm'} variant={'ghost'} className="mt-4">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user._id === message.user._id &&
                differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) <
                  TIME_THRESHOLD;
              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={message.memberId === currentMember?._id}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                />
              );
            })}
          </div>
        ))}

        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />

        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-5" />
            </span>
          </div>
        )}

        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>

      <div className="px-4">
        <Editor
          onSubmit={handleSubmit}
          disable={isPending}
          placeholder={`Trả lời tin nhắn của ${message.user.name}`}
          key={editorKey}
          innerRef={editorRef}
        />
      </div>
    </div>
  );
};

export default Thread;
