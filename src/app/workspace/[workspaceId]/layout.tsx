'use client';

import Sidebar from '@/app/workspace/[workspaceId]/Sidebar';
import Toolbar from '@/app/workspace/[workspaceId]/Toolbar';

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const workspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default workspaceIdLayout;
