import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useCreateChannelModal } from '@/features/channels/store/useCreateChannelModal';
import { useCreateChannel } from '@/features/channels/api/useCreateChannel';

const CreateChannelModal = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useCreateChannel();

  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState('');

  const handleClose = () => {
    setName('');
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { workspaceId, name },
      {
        onSuccess: (id) => {
          handleClose();
          toast.success(`Kênh chat "${name}" tạo thành công!`);
          router.push(`/workspace/${workspaceId}/channel/${id}`);
        },
        onError: () => {
          toast.error('Tạo kênh chat thất bại');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm mới kênh chat</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={isPending}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="Ví dụ: 'kế hoạch', 'Nhân sự'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending} type="submit">
              Tạo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
