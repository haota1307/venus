import { AlertTriangle, HashIcon, Loader, Vote } from 'lucide-react';

import SidebarItem, {
  sidebarItemVariants,
} from '@/app/workspace/[workspaceId]/SidebarItem';
import WorkspaceHeader from '@/app/workspace/[workspaceId]/WorkspaceHeader';

import { useGetChannels } from '@/features/channels/api/useGetChannels';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useGetMembers } from '@/features/members/api/useGetMembers';
import { useCreateChannelModal } from '@/features/channels/store/useCreateChannelModal';
import { useChannelId } from '@/hooks/useChannelId';
import { useMemberId } from '@/hooks/useMemberId';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

import WorkspaceSection from '@/app/workspace/[workspaceId]/WorkspaceSection';
import UserItem from '@/app/workspace/[workspaceId]/UserItem';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const memberId = useMemberId();

  const pathname = usePathname();
  const isActive = pathname === `/workspace/${workspaceId}/votes`;

  const [_, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-2 h-full items-center justify-center">
        <AlertTriangle className="size-8 animate-bounce text-fuchsia-500" />
        <p className="text-white text-sm">Workspace không tồn tại</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === 'admin'}
      />

      <div className="flex flex-col  px-2 mt-3 ">
        <Button
          asChild
          variant="transparent"
          size="sm"
          className={cn(
            sidebarItemVariants({ variant: isActive ? 'active' : 'default' }),
            'shrink-0 '
          )}
        >
          <Link href={`/workspace/${workspaceId}/votes`}>
            <Vote className="size-4 mr-1 shrink-0" />
            <span className="text-sm truncate">Bình chọn</span>
          </Link>
        </Button>
      </div>

      <WorkspaceSection
        label="Kênh chat"
        hint="Kênh chat mới"
        onNew={
          member.role === 'admin'
            ? () => {
                setOpen(true);
              }
            : undefined
        }
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant={channelId === item._id ? 'active' : 'default'}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Chat với thành viên"
        hint="Thêm thành viên"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
            variant={item._id === memberId ? 'active' : 'default'}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
