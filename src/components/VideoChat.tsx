import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

import {
  ControlBar,
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Id } from '../../convex/_generated/dataModel';

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
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-ping text-muted-foreground" />
    </div>;
  }
  return (
    <LiveKitRoom
      token={token}
      video={true}
      audio={true}
      connect={true}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
    >
      {/* <AudioConference /> */}
      <VideoConference />
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
  );
};

export default VideoChat;
