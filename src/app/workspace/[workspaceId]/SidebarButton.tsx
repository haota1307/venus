import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

const SidebarButton = ({ icon: Icon, label, isActive }: SidebarButtonProps) => {
  return (
    <div className="group flex flex-col items-center justify-center gap-y-0.5 cursor-pointer">
      <Button
        variant="transparent"
        className={cn(
          'size-9 p-2 group-hover:bg-accent/20',
          isActive && 'bg-accent/20 dark:bg-accent/80'
        )}
      >
        <Icon className="size-5 text-white group-hover:scale-110 transition-all" />
      </Button>
      <span className="text-[11px] text-white group-hover:text-accent dark:group-hover:text-slate-300">
        {label}
      </span>
    </div>
  );
};

export default SidebarButton;
