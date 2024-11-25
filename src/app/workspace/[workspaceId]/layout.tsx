'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import Sidebar from '@/app/workspace/[workspaceId]/Sidebar';
import Toolbar from '@/app/workspace/[workspaceId]/Toolbar';
import WorkspaceSidebar from '@/app/workspace/[workspaceId]/WorkspaceSidebar';

import { usePanel } from '@/hooks/usePanel';
import { Loader } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import Thread from '@/features/messages/components/Thread';
import Profile from '@/features/members/components/Profile';

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}
const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId, profileMemberId, onClose } = usePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  return (
    <div className="h-full">
      <Toolbar />

      <div className="flex h-[calc(100vh-40px)] w-full">
        <Sidebar />

        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ca-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={0}
            maxSize={80}
            className="bg-fuchsia-900 dark:bg-primary-foreground"
          >
            <div className="bg-fuchsia-800 dark:bg-slate-800/30 rounded-l-2xl h-full">
              <WorkspaceSidebar />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={80}
            minSize={20}
            className="dark:bg-slate-800/60"
          >
            {children}
          </ResizablePanel>

          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel
                minSize={20}
                defaultSize={30}
                className="dark:bg-slate-800/60"
              >
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<'messages'>}
                    onClose={onClose}
                  />
                ) : profileMemberId ? (
                  <Profile
                    memberId={profileMemberId as Id<'members'>}
                    onClose={onClose}
                  />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
