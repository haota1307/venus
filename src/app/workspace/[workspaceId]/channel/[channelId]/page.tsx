'use client';

import ChatInput from '@/app/workspace/[workspaceId]/channel/[channelId]/ChatInput';
import Header from '@/app/workspace/[workspaceId]/channel/[channelId]/Header';
import { useGetChannel } from '@/features/channels/api/useGetChannel';
import { useChannelId } from '@/hooks/useChannelId';
import { Loader, TriangleAlert } from 'lucide-react';

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

  if (channelLoading) {
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
      <Header title={channel.name} />
      <div className="flex-1" />
      <ChatInput placeholder={`Gừi tin nhắn đến #${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
