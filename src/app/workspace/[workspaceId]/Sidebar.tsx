'use client';

import SidebarButton from '@/app/workspace/[workspaceId]/SidebarButton';
import WorkspaceSwitcher from '@/app/workspace/[workspaceId]/WorkspaceSwitcher';
import { ModeToggle } from '@/components/ModeToggle';
import { Separator } from '@/components/ui/separator';
import UserButton from '@/features/auth/components/UserButton';
import { Bell, Home, MessageSquare, MoreHorizontal } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[70px] h-full bg-fuchsia-900 dark:bg-primary-foreground flex flex-col pt-2 gap-y-4 items-center">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Trang chủ"
        isActive={pathname.includes('/workspace')}
      />
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
