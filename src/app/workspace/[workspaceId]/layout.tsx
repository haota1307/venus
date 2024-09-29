'use client';

import Toolbar from '@/app/workspace/[workspaceId]/Toolbar';

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const workspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      {children}
    </div>
  );
};

export default workspaceIdLayout;
