import { useGetMember } from '@/features/members/api/useGetMember';
import { Id } from '../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ChevronDown,
  Loader,
  MailIcon,
  XIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useUpdateMember } from '@/features/members/api/useUpdateMember';
import { useRemoveMember } from '@/features/members/api/useRemoveMember';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/useConfirm';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}

const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [UpdateDialog, confirmUpdate] = useConfirm(
    'Thay đổi quyền người dùng',
    'Bạn có chắc muốn thay đổi quyền của người này?'
  );

  const [LeaveDialog, confirmLeave] = useConfirm(
    'Rời khỏi workspace',
    'Bạn có chắc muốn rời khỏi workspace này?'
  );

  const [RemoveDialog, confirmRemove] = useConfirm(
    'Xóa thành viên khỏi workspace',
    'Bạn có chắc muốn xóa người này khỏi workspace?'
  );

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({
      workspaceId,
    });

  const { data: member, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  });

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();

  const onRemove = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success('Thành viên đã được xóa khỏi nhóm');
          onClose();
        },
        onError: () => {
          toast.error('Có lỗi xảy ra! xóa thất bại');
        },
      }
    );
  };

  const onLeave = async () => {
    const ok = await confirmLeave();

    if (!ok) return;
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          router.replace('/setup');
          setTimeout(() => {
            toast.success('Bạn đã rời khỏi workspace');
          }, 1000);
        },
        onError: () => {
          toast.error('Có lỗi xảy ra! rời khỏi workspace thất bại');
        },
      }
    );
  };

  const onUpdate = async (role: 'admin' | 'member') => {
    const ok = await confirmUpdate();

    if (!ok) return;
    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success('Quyền người dùng đã thay đổi');
          onClose();
        },
        onError: () => {
          toast.error('Có lỗi xảy ra! thay đổi thất bại');
        },
      }
    );
  };

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Hồ sơ</p>
          <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex items-center justify-center h-full mt-4 flex-1">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Hồ sơ</p>
          <Button
            onClick={onClose}
            size={'iconSm'}
            variant={'ghost'}
            className="mt-4"
          >
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex items-center justify-center h-full flex-1">
          <AlertTriangle className="size-5 text-muted-foreground mr-2" />
          <p>Người dùng không còn tồn tại!</p>
        </div>
      </div>
    );
  }

  const avatarFallback = member.user.name?.[0].toUpperCase() || 'M';

  return (
    <>
      <RemoveDialog />
      <LeaveDialog />
      <UpdateDialog />
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold">Hồ sơ</p>
          <Button
            onClick={onClose}
            size={'iconSm'}
            variant={'ghost'}
            className="mt-4"
          >
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex items-center justify-center p-4">
          <Avatar className="max-w-56 max-h-56 size-full rounded-md">
            <AvatarImage
              className="rounded-md shadow-inner"
              src={member.user.image}
            />
            <AvatarFallback className="bg-fuchsia-600 aspect-square text-white shadow-md rounded-md text-6xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4 text-xl font-bold">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === 'admin' &&
          currentMember?._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={'outline'} className="w-full capitalize">
                    {member.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                    <ChevronDown className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onUpdate(role as 'admin' | 'member')
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Quản trị viên
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Thành viên
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={onRemove}
                variant={'destructive'}
                className="w-full"
              >
                Xóa khỏi workspace
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember.role !== 'admin' ? (
            <div className="mt-4">
              <Button
                variant={'destructive'}
                className="w-full"
                onClick={onLeave}
              >
                Rời khỏi workspace
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold my-4">Thông tin liên hệ</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-muted-foreground">
                Email
              </p>
              <Link
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${member.user.email}`}
                className="text-sm hover:underline text-indigo-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
