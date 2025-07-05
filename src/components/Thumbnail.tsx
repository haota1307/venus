import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FileIcon } from 'lucide-react';
import Image from 'next/image';
import { Id } from '../../convex/_generated/dataModel';

interface ThumbnailProps {
  url: string | null | undefined;
  type:
    | {
        _id: Id<'_storage'>;
        _creationTime: number;
        contentType?: string | undefined | undefined;
        sha256: string;
        size: number;
      }
    | null
    | undefined;
}

const Thumbnail = ({ url, type }: ThumbnailProps) => {
  if (!url || !type) return null;

  const isImageTypes = ['image/jpeg', 'image/png'];
  const isPDF = 'application/pdf';
  const isVideo = 'video/mp4';

  if (type?.contentType === isPDF) {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-300 stroke-indigo-400" />
        <a
          href={url}
          target="_blank"
          rel="nooperner noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          PDF File
        </a>
      </div>
    );
  }

  if (type?.contentType === isVideo) {
    return (
      <div className="relative overflow-hidden rounded-lg my-2">
        <video
          className="relative overflow-hidden max-h-[50vh] border rounded-lg"
          controls
        >
          <source src={url} type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      </div>
    );
  }

  if (type?.contentType && isImageTypes.includes(type?.contentType)) {
    return (
      <Dialog>
        <DialogTrigger>
          {isImageTypes.includes(type?.contentType) && (
            <div className="relative overflow-hidden max-w-[200px] border rounded-lg my-2 cursor-zoom-in">
              <Image
                src={url}
                alt=""
                width={200}
                height={200}
                className="rounded-md object-cover size-full"
              />
            </div>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-[600px] border-none bg-transparent p-0 shadow-none">
          {isImageTypes.includes(type?.contentType) && (
            <Image
              src={url}
              alt=""
              width={600}
              height={400}
              className="rounded-md object-cover size-full"
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }
};

export default Thumbnail;
