'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Loader } from 'lucide-react';
import { toast } from 'sonner';

import type { Id } from '../../../../../../convex/_generated/dataModel';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useMemberId } from '@/hooks/useMemberId';
import { useCreateOrGetConversation } from '@/features/conversations/api/useCreateOrGetConversation';
import Conversation from '@/app/workspace/[workspaceId]/member/[memberId]/Conversation';

export default function MemberPage() {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const [conversationId, setConversationId] = useState<Id<'conversations'> | null>(null);

  const { mutate, isPending: conversationIsLoading } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      { workspaceId, memberId },
      {
        onSuccess: (data) => {
          console.log(data);
          setConversationId(data);
        },
        onError: () => {
          toast.error('Lỗi khi tải cuộc trò chuyện');
        },
      }
    );
  }, [memberId, mutate, workspaceId]);

  if (conversationIsLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (!conversationId)
    return (
      <div className="h-full flex items-center justify-center flex-col gap-y-2">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Không tìm thấy cuộc trò chuyện</p>
      </div>
    );

  return <Conversation id={conversationId} />;
}
