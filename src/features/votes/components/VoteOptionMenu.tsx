'usc client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { EllipsisVertical, Trash } from 'lucide-react';
import { useState } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useCurrentUser } from '@/features/auth/api/useCurrentUser';
import { useConfirm } from '@/hooks/useConfirm';
import { Button } from '@/components/ui/button';
import { useDeleteVote } from '@/features/votes/api/useDeleteVote';

interface VoteOption {
  _creationTime: number;
  _id: Id<'voteOptions'>; // Sử dụng Id cho các tùy chọn
  body: string;
  voteCount: number;
  voters: {
    _id: Id<'users'>;
    _creationTime: number;
    name?: string;
    image?: string;
    email?: string;
    emailVerificationTime?: number;
  }[];
}

interface Vote {
  _id: Id<'votes'>;
  _creationTime: number;
  workspaceId: Id<'workspaces'>;
  body: string;
  isLive: boolean;
  ownerId: Id<'users'>;
  options: VoteOption[];
}

interface Props {
  vote: Vote;
  className?: string;
}

const PollOptionsMenu = ({ vote, className }: Props) => {
  const user = useCurrentUser();

  const [ConfirmDialog, confirm] = useConfirm(
    'Bạn có chắc muốn xóa cuộc bình chọn?',
    'Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn cuộc bình chọn của bạn và tất cả các phiếu bầu.'
  );

  const { mutate: deleteVote } = useDeleteVote();

  const isAdmin = vote.ownerId === user?.data?._id;

  if (!isAdmin) {
    return null;
  }

  const handleDeleteVote = async () => {
    const ok = await confirm();
    if (ok) {
      await deleteVote({ voteId: vote._id });
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className={className}>
            <EllipsisVertical size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2 space-y-1">
          <Button
            onClick={handleDeleteVote}
            variant={'ghost'}
            className="w-full"
          >
            <Trash className="mr-2 size-4" />
            <span>Xóa</span>
          </Button>
          {/* <DropdownMenuItem
            onSelect={() => setOpenDeleteDialog(true)}
            className="text-sm text-destructive"
          >
            
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PollOptionsMenu;
