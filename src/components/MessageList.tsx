import { useState } from 'react';

import { Id } from '../../convex/_generated/dataModel';
import { vi } from 'date-fns/locale';
import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { GetMessagesReturnType } from '@/features/messages/api/useGetMessages';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

import Message from '@/components/Message';
import ChannelHero from '@/components/ChannelHero';
import { Loader } from 'lucide-react';
import ConversationHero from '@/components/ConversationHero';

const TIME_THRESHOLD = 3;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: 'channel' | 'thread' | 'conversation';
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);

  if (isToday(date)) return 'Hôm nay';

  if (isYesterday(date)) return 'Hôm qua';

  return format(dateStr, 'EEEE, d MMMM, yyyy', { locale: vi });
};

const MessageList = ({
  data,
  channelName,
  channelCreationTime,
  memberName,
  memberImage,
  variant = 'channel',
  loadMore,
  canLoadMore,
  isLoadingMore,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

  const workspaceId = useWorkspaceId();
  const { data: currentMember, isLoading } = useCurrentMember({ workspaceId });

  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, 'MM-dd-yyyy');

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof data>
  );

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white dark:bg-slate-700 px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user._id === message.user._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime)
              ) < TIME_THRESHOLD;
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
                type={message.type}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === 'thread'}
                threadCount={message.threadCount}
                threadName={message.threadName}
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
            <Loader className="size-5 an" />
          </span>
        </div>
      )}

      {variant === 'channel' && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}

      {variant === 'conversation' && memberName && memberImage && (
        <ConversationHero name={memberName} image={memberImage} />
      )}
    </div>
  );
};

export default MessageList;

/** NOTE
 *  {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div></div>
      ))}
 *  {'1-1-2024': [mess1, mess2,...,messN]}
 *  {'2-1-2024': [mess1, mess2,...,messN]}
 */
