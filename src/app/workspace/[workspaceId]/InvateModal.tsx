import { Copy, RefreshCcw } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { useNewJoinCode } from '@/features/workspaces/api/useNewJoinCode';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useConfirm } from '@/hooks/useConfirm';
import React from 'react';

interface InvateModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

const InvateModal = ({ open, setOpen, joinCode, name }: InvateModalProps) => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    'Bạn có chắc không?',
    'Điều này sẽ vô hiệu hóa mã mời hiện tại và tạo một mã mời mới.'
  );

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success('Liên kết đã được sao chép'));
  };

  const { mutate, isPending } = useNewJoinCode();

  const handleNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success('Tạo mới thành công');
        },
        onError: () => {
          toast.error('Tạo mới thất bại');
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mời mọi người tham gia {name}</DialogTitle>
            <DialogDescription>
              Sử dụng mã mời bên dưới để mời mọi người tham gia {name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button onClick={handleCopy} variant={'ghost'} size={'sm'}>
              Sao chép liên kết tham gia
              <Copy className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={handleNewCode}
              variant={'outline'}
              disabled={isPending}
            >
              Tạo mới
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild disabled={isPending}>
              <Button>Đóng</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvateModal;
