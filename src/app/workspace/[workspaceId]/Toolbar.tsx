'use client';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useGetChannels } from '@/features/channels/api/useGetChannels';
import { useGetMembers } from '@/features/members/api/useGetMembers';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { Info, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Toolbar = () => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const [open, setOpen] = useState(false);

  const { data } = useGetWorkspace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const onChannelClick = (channelId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav className="bg-fuchsia-900 flex items-center justify-between h-10 p-1.5 w-full">
      <div className="flex-1" />

      <div className="w-[280px] grow-[2] shrink">
        <Button
          size={'sm'}
          onClick={() => setOpen(true)}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2 shadow-lg"
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Tìm kiếm {data?.name}</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Tìm kiếm" />
          <CommandList>
            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            <CommandGroup heading="Kênh chat">
              {channels?.map((channel) => (
                <CommandItem onSelect={() => onChannelClick(channel._id)}>
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Thành viên">
              {members?.map((member) => (
                <CommandItem onSelect={() => onMemberClick(member._id)}>
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant={'transparent'} size={'iconSm'}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
