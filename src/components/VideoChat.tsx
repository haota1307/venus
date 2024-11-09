import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

import {
  ControlBar,
  DisconnectButton,
  LiveKitRoom,
  ParticipantName,
  ParticipantTile,
  RoomAudioRenderer,
  VideoConference,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Id } from '../../convex/_generated/dataModel';
import { useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface VideoChatProps {
  channelId: string;
  user:
    | {
        _id: Id<'users'>;
        _creationTime: number;
        email?: string | undefined;
        name?: string | undefined;
        image?: string | undefined;
        emailVerificationTime?: number | undefined;
        isAnonymous?: boolean | undefined;
        phone?: string | undefined;
        phoneVerificationTime?: number | undefined;
      }
    | null
    | undefined;
}

const VideoChat = ({ user, channelId }: VideoChatProps) => {
  const searchParams = useSearchParams();

  const [token, setToken] = useState('');
  useEffect(() => {
    const name = user?.name;
    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${channelId}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [channelId, user]);

  if (token === '') {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-ping text-muted-foreground" />
        <p>Đang tải...</p>
      </div>
    );
  }

  const currentParams = new URLSearchParams(searchParams?.toString());

  return (
    <LiveKitRoom
      token={token}
      video={true}
      audio={true}
      connect={true}
      onDisconnected={() => {
        currentParams.delete('videoCall');
        window.history.replaceState(
          {},
          '',
          `${window.location.pathname}?${currentParams.toString()}`
        );
      }}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
    >
      <VideoConference
        chatMessageFormatter={(message) => (
          <div className="flex items-start space-x-1 p-1 rounded-md shadow-sm">
            <Avatar className="size-6 mr-1 rounded-md">
              <AvatarImage
                className="rounded-md shadow-inner"
                src={user?.image}
              />
              <AvatarFallback className="bg-fuchsia-600 text-white shadow-md rounded-md text-sm">
                {user?.name!.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <strong className="text-indigo-50">{user?.name}:</strong>
            <p className="text-slate-50">{message}</p>
          </div>
        )}
      />
      <ControlBar controls={{ chat: false }} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

export default VideoChat;
