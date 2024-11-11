'use client';

import WorkspaceSwitcher from '@/app/workspace/[workspaceId]/WorkspaceSwitcher';
import { Hint } from '@/components/hint';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UserButton from '@/features/auth/components/UserButton';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/useCreateWorkspaceModal';
import { Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const [_, setOpen] = useCreateWorkspaceModal();

  return (
    <aside className="w-[70px] h-full bg-fuchsia-900 dark:bg-primary-foreground flex flex-col pt-2 gap-y-4 items-center">
      <WorkspaceSwitcher />

      <div className="group flex flex-col items-center justify-center gap-y-0.5 cursor-pointer size-10">
        <Hint label={'Tạo mới workspace'} side="right" align="center">
          <Button
            variant="transparent"
            size={'icon'}
            className={'size-10 p-2 group-hover:bg-accent/20 bg-accent/30'}
            onClick={() => setOpen(true)}
          >
            <Plus className="text-white group-hover:scale-110 transition-all" />
          </Button>
        </Hint>
      </div>

      {/* <SidebarButton
        icon={Home}
        label="Trang chủ"
        isActive={pathname.includes('/workspace')}
      /> */}
      {/* <SidebarButton icon={MessageSquare} label="Trò chuyện" /> */}
      {/* <SidebarButton icon={Bell} label="Hoạt động" />
      <SidebarButton icon={MoreHorizontal} label="Thêm" /> */}

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto mb-4">
        <ModeToggle />
        <Separator className="my-2" />
        <UserButton />
      </div>
    </aside>
  );
};

export default Sidebar;
