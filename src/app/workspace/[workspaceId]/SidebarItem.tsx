import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';
import Link from 'next/link';
import { cva, VariantProps } from 'class-variance-authority';

import { Button } from '@/components/ui/button';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemVariants>['variant'];
}

const SidebarItem = ({ icon: Icon, id, label, variant }: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      asChild
      variant="transparent"
      size="sm"
      className={cn(sidebarItemVariants({ variant }), 'shrink-0 ')}
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};

export const sidebarItemVariants = cva(
  'flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden',
  {
    variants: {
      variant: {
        default: 'text-[#F9EDFFCC]',
        active: 'text-[#481349] bg-white/80 hover:bg-white/80 font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export default SidebarItem;
