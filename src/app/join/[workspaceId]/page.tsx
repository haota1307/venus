'use client';

import { Button } from '@/components/ui/button';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/useGetWorkspaceInfo';
import { useJoin } from '@/features/workspaces/api/useJoin';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import VerificationInput from 'react-verification-input';
import { toast } from 'sonner';

interface JoinPageProps {
  params: {
    workspaceId: string;
  };
}

const JoinPage = ({ params }: JoinPageProps) => {
  const workspaceId = useWorkspaceId();

  const router = useRouter();

  const { mutate, isPending } = useJoin();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplte = (value: string) => {
    mutate(
      {
        workspaceId,
        joinCode: value,
      },
      {
        onSuccess: (id) => {
          router.push(`/workspace/${id}`);
          toast.success('Tham gia workspace thành công');
        },
        onError: () => {
          toast.error('Tham gia workspace không thành công, có thể mã mời của bạn bị sai.');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-ping text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-sm">
      <Image alt="logo" src={'/logo.svg'} width={100} height={100} />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-lg">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h2 className="text-2xl font-bold">Tham gia "{data?.name}"</h2>
          <p className="text-md text-muted-foreground">Nhập mã mời để tham gia</p>
        </div>
        <VerificationInput
          onComplete={handleComplte}
          autoFocus
          length={8}
          classNames={{
            container: cn('flex gap-x-2', isPending && 'opacity-50 cursor-not-allowed'),
            character:
              'uppercase h-full rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
            characterInactive: 'bg-muted',
            characterSelected: 'text-black bg-white',
            characterFilled: 'text-black bg-white',
          }}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size={'lg'} variant={'outline'} asChild>
          <Link href={'/'}>Trở về trang chủ</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;

//6:27:34
