import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface HeaderProp {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

const Header = ({ memberImage, memberName = 'Member', onClick }: HeaderProp) => {
  const avatarFallback = memberName.charAt(0).toLocaleUpperCase();

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant={'ghost'}
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        size={'sm'}
        onClick={onClick}
      >
        <Avatar className="size-6 mr-1 rounded-md">
          <AvatarImage className="rounded-md shadow-inner" src={memberImage} />
          <AvatarFallback className="bg-fuchsia-600 text-white shadow-md rounded-md text-sm">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <ChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
};

export default Header;

// 5 : 00 : 00
