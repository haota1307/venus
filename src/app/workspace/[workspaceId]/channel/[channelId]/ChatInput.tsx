import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import Quill from 'quill';

import { toast } from 'sonner';

import { useChannelId } from '@/hooks/useChannelId';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useCreateMessage } from '@/features/messages/api/useCreateMessage';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIspending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
    try {
      setIspending(true);
      await createMessage(
        {
          workspaceId,
          channelId,
          body,
        },
        { throwError: true }
      );

      setEditorKey((prevKey) => prevKey + 1); // Giúp sau khi gửi tin nhắn thì ô soạn tin nhắn sẽ được reset
    } catch (error) {
      toast.error('Gửi tin nhắn thất bại!');
    } finally {
      setIspending(false);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disable={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
