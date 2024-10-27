import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ChannelHeroProps {
  name: string;
  creationTime: number;
}

const ChannelHero = ({ creationTime, name }: ChannelHeroProps) => {
  return (
    <div className="mt-[80px] mx-5 mb-4">
      <p className="text-2xl font-bold flex items-center mb-2"># {name}</p>
      <p className="font-normal text-slate-800 dark:text-slate-200 mb-4">
        Kênh chat được tạo vào ngày{' '}
        {format(creationTime, 'do MMMM, yyyy', { locale: vi })}.
      </p>
    </div>
  );
};

export default ChannelHero;
