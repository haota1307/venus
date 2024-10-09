import { useGetMember } from '@/features/members/api/useGetMember';
import { Id } from '../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader, MailIcon, XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}

const Profile = ({ memberId, onClose }: ProfileProps) => {
  const { data: member, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  });

  if (isLoadingMember) {
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
        {member.user.name}
      </div>
      <Separator />
      <div className="flex flex-col p-4">
        <p className="text-sm font-bold my-4">Thông tin liên hệ</p>
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">
            <MailIcon className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-muted-foreground">Email</p>
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
  );
};

export default Profile;
