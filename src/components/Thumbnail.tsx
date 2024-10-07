import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ThumbnailProps {
  url: string | null | undefined;
}

const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[200px] border rounded-lg my-2 cursor-zoom-in">
          <img src={url} alt="" className="rounded-md object-cover size-full" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] border-none bg-transparent p-0 shadow-none">
        <img src={url} alt="" className="rounded-md object-cover size-full" />
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
