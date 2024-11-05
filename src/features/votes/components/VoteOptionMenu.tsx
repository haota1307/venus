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
import DeleteVoteDialog from '@/features/votes/components/DeleteVoteDialog';

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

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const isAdmin = vote.ownerId === user?.data?._id;

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className={className}>
            <EllipsisVertical size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2 space-y-1">
          <DropdownMenuItem
            onSelect={() => setOpenDeleteDialog(true)}
            className="text-sm text-destructive"
          >
            <Trash className="mr-2 size-4" />
            <span>Xóa</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteVoteDialog
        voteId={vote._id}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onSuccess={() => setOpenDeleteDialog(false)}
      />
    </>
  );
};

export default PollOptionsMenu;
