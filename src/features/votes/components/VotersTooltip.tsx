import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Id } from '../../../../convex/_generated/dataModel';

type Voter = {
  _id: Id<'users'>;
  _creationTime: number;
  name?: string;
  image?: string;
  email?: string;
  emailVerificationTime?: number;
};

type Props = {
  voters: Voter[];
  totalVotes: number;
  className?: string; // Định nghĩa className trực tiếp ở đây
};

const VotersTooltip = ({ totalVotes, voters, className }: Props) => {
  const votersToDisplay = voters.slice(0, 5);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={className}>
          <div className="flex -space-x-4">
            {votersToDisplay &&
              votersToDisplay.map((voter, index) => (
                <Avatar className="size-6 mr-1 rounded-md" key={index}>
                  <AvatarImage
                    className="rounded-md shadow-inner"
                    src={voter.image}
                  />
                  <AvatarFallback className="bg-fuchsia-600 text-white shadow-md rounded-md text-sm">
                    {voter.name ? voter.name.charAt(0).toUpperCase() : ''}
                  </AvatarFallback>
                </Avatar>
              ))}

            {voters.length > 5 && (
              <Avatar className="size-8 ring-2 ring-white">
                <AvatarFallback className="text-black text-sm bg-gray-200">
                  +{voters.length - 5}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </TooltipTrigger>

        <TooltipContent className="bg-black text-white text-sm">
          {totalVotes} người tham gia bình chọn
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VotersTooltip;
