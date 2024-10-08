import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

const ConversationHero = ({ image, name = 'Member' }: ConversationHeroProps) => {
  const avatarFallback = name?.charAt(0).toUpperCase();

  return (
    <div className="mt-[80px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-16 mr-2 rounded-md">
          <AvatarImage className="rounded-md shadow-inner" src={image} />
          <AvatarFallback className="bg-fuchsia-600 text-white shadow-md rounded-md text-sm">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>
      <p className="text-2xl font-bold">{name}</p>
      <p className="font-normal text-slate-800 mb-4">
        Đây là cuộc trò chuyện riêng tư giữa bạn và <strong>{name}</strong>
      </p>
    </div>
  );
};

export default ConversationHero;
