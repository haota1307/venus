import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';

interface ThreadBarProps {
  count?: number;
  image?: string;
  timestamp?: number;
  name?: string;
  onClick?: () => void;
}

const ThreadBar = ({
  count,
  image,
  onClick,
  timestamp,
  name = 'Member',
}: ThreadBarProps) => {
  const avatarFallback = name.charAt(0).toLocaleUpperCase();

  if (!count || !timestamp) return null;

  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-6 mr-1 rounded-md">
          <AvatarImage className="rounded-md shadow-inner" src={image} />
          <AvatarFallback className="bg-fuchsia-600 text-white shadow-md rounded-md text-sm">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count} trả lời
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidde block">
          trả lời cuối cùng{' '}
          {formatDistanceToNow(timestamp, { addSuffix: true, locale: vi })}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden hover:underline">
          Xem thêm
        </span>
      </div>
      <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
    </button>
  );
};

export default ThreadBar;
