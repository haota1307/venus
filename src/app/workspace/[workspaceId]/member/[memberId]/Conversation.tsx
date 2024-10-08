import { useMemberId } from '@/hooks/useMemberId';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { useGetMember } from '@/features/members/api/useGetMember';
import { useGetMessages } from '@/features/messages/api/useGetMessages';
import { Loader } from 'lucide-react';
import Header from '@/app/workspace/[workspaceId]/member/[memberId]/Header';
import ChatInput from '@/app/workspace/[workspaceId]/member/[memberId]/ChatInput';
import MessageList from '@/components/MessageList';

interface ConversationProps {
  id: Id<'conversations'>;
}

const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();

  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });
  const { loadMore, results, status } = useGetMessages({
    conversationId: id,
  });

  if (memberLoading || status === 'LoadingFirstPage') {
    <div className="flex items-center justify-center h-full">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>;
  }

  return (
    <div className="flex flex-col h-full">
      <Header memberName={member?.user.name} memberImage={member?.user.image} onClick={() => {}} />
      <MessageList
        data={results}
        variant="conversation"
        memberName={member?.user.name}
        memberImage={member?.user.image}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <ChatInput placeholder={`Gửi tin nhắn cho ${member?.user.name}`} conversationId={id} />
    </div>
  );
};

export default Conversation;
