import React, { useState } from 'react';
import { TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useUpdateWorkspace } from '@/features/workspaces/api/useUpdateWorkspace';
import { useRemoveWorkspace } from '@/features/workspaces/api/useRemoveWorkspace';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/useConfirm';

interface PreferencesProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

const PreferencesModal = ({
  initialValue,
  open,
  setOpen,
}: PreferencesProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [ConfirmDialog, beforeRemove] = useConfirm(
    'Bạn có chắc không?',
    'Hành động này không thể hoàn tác.'
  );

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          toast.success(`Đã cập nhật tên workspace thành "${value}"`);
          setEditOpen(false);
        },
        onError: () => {
          toast.error('Cập nhật workspace thất bại');
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await beforeRemove();
    if (!ok) return;

    removeWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success(`Đã xóa workspace ${value}`);
          router.replace('/');
        },
        onError: () => {
          toast.error('Xóa workspace thất bại');
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{initialValue}</DialogTitle>
          </DialogHeader>

          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Tên workspace</p>
                    <p className="text-sm text-indigo-500 hover:underline font-semibold">
                      Chỉnh sửa
                    </p>
                  </div>
                  <p className="text-sm">{initialValue}</p>
                </div>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Đổi tên workspace này</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Tên workspace ví dụ như 'Công việc', 'Cá nhân', 'Nhà'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingWorkspace}>
                        Hủy
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace}>Lưu</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              disabled={isRemovingWorkspace}
              variant={'destructive'}
              onClick={handleRemove}
              className="flex items-center justify-start gap-x-2 px-5 py-4 rounded-lg border cursor-pointer"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-bold">Xóa workspace</p>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreferencesModal;
