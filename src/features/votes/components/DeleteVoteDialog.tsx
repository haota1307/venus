import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import { Id } from '../../../../convex/_generated/dataModel';
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';

type Props = {
  voteId: Id<'votes'>;
  onSuccess?: () => void;
} & AlertDialogProps;

const DeleteVoteDialog = ({
  voteId,
  onSuccess: handleSuccess,
  ...dialogProps
}: Props) => {
  const handleDelete = (evt: React.MouseEvent) => {
    evt.preventDefault();

    // TODO
  };

  const isFieldDisabled = false;

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc muốn xóa cuộc bình chọn
          </AlertDialogTitle>
          <AlertDialogDescription>
            Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn cuộc
            bình chọn của bạn và tất cả các phiếu bầu của bạn khỏi sự kiện.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isFieldDisabled}
            className={cn(buttonVariants({ variant: 'ghost' }))}
          >
            Hủy
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isFieldDisabled}
            onClick={handleDelete}
            className={cn(buttonVariants({ variant: 'destructive' }))}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteVoteDialog;
