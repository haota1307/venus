import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Id } from '../../../../convex/_generated/dataModel';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { usePanel } from '@/hooks/usePanel';

const userItemVariants = cva(
  'flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden',
  {
    variants: {
      variant: {
        default: 'text-[#F9EDFFCC]',
        active: 'text-[#481349] bg-white/90 hover:bg-white/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface UserItemProps {
  id: Id<'members'>;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>['variant'];
}

const UserItem = ({ id, label = 'Member', image, variant }: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });

  const { onOpenProfile } = usePanel();

  const avatarFallback = label.charAt(0).toUpperCase();

  const currentUserId = member?._id;

  return (
    <Button
      variant="transparent"
      className={cn(
        userItemVariants({ variant }),
        'mb-1',
        id === currentUserId && 'hover:cursor-not-allowed'
      )}
      size="sm"
      asChild
    >
      {id !== currentUserId ? (
        <Link href={`/workspace/${workspaceId}/member/${id}`}>
          <Avatar className="size-6 mr-1 rounded-md">
            <AvatarImage className="rounded-md shadow-inner" src={image} />
            <AvatarFallback className="bg-fuchsia-600 text-white shadow-md rounded-md text-sm">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm truncate">{label}</span>
        </Link>
      ) : (
        <button onClick={() => onOpenProfile(id)}>
          <Avatar className="size-6 mr-1 rounded-md">
            <AvatarImage className="rounded-md shadow-inner" src={image} />
            <AvatarFallback className="bg-fuchsia-600 text-white shadow-md rounded-md text-sm">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm truncate">{label}</span>
          <span className="text-sm truncate">(Bạn)</span>
        </button>
      )}
    </Button>
  );
};

export default UserItem;
