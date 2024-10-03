import { useState } from 'react';
import { TrashIcon } from 'lucide-react';
import { FaChevronDown } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { useChannelId } from '@/hooks/useChannelId';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useConfirm } from '@/hooks/useConfirm';

import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useUpdateChannel } from '@/features/channels/api/useUpdateChannell';
import { useRemoveChannel } from '@/features/channels/api/useRemoveChannell';

interface HeaderProp {
  title: string;
}

const Header = ({ title }: HeaderProp) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [value, setValue] = useState(title);
  const [editOpen, setEditOpen] = useState(false);

  const [ConfirmDialog, confirm] = useConfirm(
    'Xóa kênh này?',
    'Bạn có chắc muốn xóa kênh chat này, hành động này không thể hoàn tác'
  );

  const { data: member } = useCurrentMember({ workspaceId });

  const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel();

  const handleOpen = (value: boolean) => {
    if (member?.role !== 'admin') return;

    setEditOpen(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success('Cập nhật thành công');
        },
        onError: () => {
          toast.error('Cập nhật thất bại');
        },
        onSettled: () => {
          setEditOpen(false);
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;
    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success('Kênh đã được xóa');
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error('Xóa kênh thất bại');
        },
        onSettled: () => {
          setEditOpen(false);
        },
      }
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-lg font-semibold px-2 overflow-hidden w-auto" size="sm">
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Tên kênh</p>
                    {member?.role === 'admin' && (
                      <p className="text-sm text-indigo-500 hover:underline font-semibold">Sửa</p>
                    )}
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Đổi tên kênh chat</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    value={value}
                    disabled={isUpdatingChannel}
                    onChange={(e) => setValue(e.target.value)}
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="ví dụ: Tài chính"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingChannel}>
                        Hủy
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingChannel} type="submit">
                      Lưu
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === 'admin' && (
              <button
                onClick={handleRemove}
                disabled={isRemovingChannel}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50  text-rose-600"
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Xóa kênh</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
