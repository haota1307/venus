'use client';

import ChatInput from '@/app/workspace/[workspaceId]/channel/[channelId]/ChatInput';
import Header from '@/app/workspace/[workspaceId]/channel/[channelId]/Header';
import Call from '@/components/Call';
import MessageList from '@/components/MessageList';
import VideoChat from '@/components/VideoChat';
import { useCurrentUser } from '@/features/auth/api/useCurrentUser';
import { useGetChannel } from '@/features/channels/api/useGetChannel';
import { useGetMessages } from '@/features/messages/api/useGetMessages';
import { useChannelId } from '@/hooks/useChannelId';
import { Loader, TriangleAlert } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ChannelIdPage = () => {
  const searchParams = useSearchParams();
  const channelId = useChannelId();

  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isCall, setIsCall] = useState(false);

  useEffect(() => {
    const videoCallParams = searchParams?.get('videoCall');
    const callParams = searchParams?.get('call'); // Thêm params call
    setIsVideoCall(videoCallParams === 'true');
    setIsCall(callParams === 'true'); // Cập nhật trạng thái isCall
  }, [searchParams, channelId]);

  const { results, loadMore, status } = useGetMessages({ channelId });
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading || status === 'LoadingFirstPage') {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex flex-1 flex-col items-center justify-center">
        <TriangleAlert className="size-5 text-muted-foreground " />
        <p className="text-sm text-muted-foreground">Kênh chat không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {!isVideoCall &&
        !isCall && ( // Cập nhật điều kiện hiển thị
          <>
            <Header title={channel.name} />
            <MessageList
              channelName={channel.name}
              channelCreationTime={channel._creationTime}
              data={results}
              loadMore={loadMore}
              isLoadingMore={status === 'LoadingMore'}
              canLoadMore={status === 'CanLoadMore'}
            />
            <ChatInput placeholder={`Gừi tin nhắn đến #${channel.name}`} />
          </>
        )}
      {isVideoCall && <VideoChat channelId={channelId} user={user} />}
      {isCall && <Call channelId={channelId} user={user} />}
    </div>
  );
};

export default ChannelIdPage;
