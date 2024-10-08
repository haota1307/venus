'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import Sidebar from '@/app/workspace/[workspaceId]/Sidebar';
import Toolbar from '@/app/workspace/[workspaceId]/Toolbar';
import WorkspaceSidebar from '@/app/workspace/[workspaceId]/WorkspaceSidebar';

import { usePanel } from '@/hooks/usePanel';
import { Loader } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import Thread from '@/features/messages/components/Thread';

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}
const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId, onClose } = usePanel();

  const showPanel = !!parentMessageId;
  return (
    <div className="h-full">
      <Toolbar />

      <div className="flex h-[calc(100vh-40px)] w-full">
        <Sidebar />

        <ResizablePanelGroup direction="horizontal" autoSaveId="ca-workspace-layout">
          <ResizablePanel defaultSize={20} minSize={11} maxSize={80} className="bg-fuchsia-900/95">
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} minSize={20}>
            {children}
          </ResizablePanel>

          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={30}>
                {parentMessageId ? (
                  <Thread messageId={parentMessageId as Id<'messages'>} onClose={onClose} />
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
