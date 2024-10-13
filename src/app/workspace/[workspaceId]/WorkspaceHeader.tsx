import React, { useState } from 'react';
import { ChevronDown, ListFilter, SquarePen } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Hint } from '@/components/hint';

import { Doc } from '../../../../convex/_generated/dataModel';
import PreferencesModal from '@/app/workspace/[workspaceId]/PreferencesModal';
import InvateModal from '@/app/workspace/[workspaceId]/InvateModal';

interface WorkspaceHeaderProps {
  workspace: Doc<'workspaces'>;
  isAdmin: boolean;
}

const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [invateModalOpen, setInvateModalOpen] = useState(false);

  return (
    <>
      <InvateModal
        open={invateModalOpen}
        setOpen={setInvateModalOpen}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initialValue={workspace.name}
      />
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5 bg-in">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={'transparent'}
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
              size={'sm'}
            >
              <span className="truncate">{workspace.name}</span>
              <ChevronDown className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="start"
            className="w-64 overflow-hidden"
          >
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="size-8 relative overflow-hidden text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2 bg-fuchsia-700 shadow-md">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">Đang mở</p>
              </div>
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2 w-auto"
                  onClick={() => {
                    setInvateModalOpen(true);
                  }}
                >
                  <p className="truncate">
                    Mời mọi người tham gia {workspace.name}
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setPreferencesOpen(true)}
                >
                  Tùy chọn
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-0.5">
          <Hint label="Lọc cuộc trò chuyện" side="bottom">
            <Button variant={'transparent'} size={'iconSm'}>
              <ListFilter className="size-4" />
            </Button>
          </Hint>

          <Hint label="Tin nhắn mới" side="bottom">
            <Button variant={'transparent'} size={'iconSm'}>
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};

export default WorkspaceHeader;
