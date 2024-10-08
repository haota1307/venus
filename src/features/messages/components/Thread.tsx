import { useState } from 'react';

import { Id } from '../../../../convex/_generated/dataModel';

import { AlertTriangle, Loader, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Message from '@/components/Message';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useGetMessage } from '@/features/messages/api/useGetMessage';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';

interface ThreadProps {
  messageId: Id<'messages'>;
  onClose: () => void;
}

const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();

  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: loadingMessage } = useGetMessage({ id: messageId });

  if (loadingMessage) {
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
  );
};

export default Thread;
