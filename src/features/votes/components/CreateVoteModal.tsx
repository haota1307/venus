'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import { useCreateVoteModal } from '@/features/votes/store/useCreateVoteModal';
import TextWithCounter from '@/components/TextWithCounter';
import { Plus, Trash } from 'lucide-react';
import { useCurrentUser } from '@/features/auth/api/useCurrentUser';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useCreateVote } from '@/features/votes/api/useCreateVote';

export const vote = {
  body: {
    minLength: 1,
    maxLength: 500,
  },
  options: {
    minLength: 1,
    maxLength: 100,
    minCount: 2,
    maxCount: 5,
  },
} as const;

export const createLivePollSchema = z.object({
  workspaceId: z.any(),
  ownerId: z.any(),
  body: z
    .string()
    .min(vote.body.minLength, {
      message: `Nội dung cuộc bình chọn phải có ít nhất ${vote.body.minLength} ký tự`,
    })
    .max(vote.body.maxLength, {
      message: `Nội dung cuộc bình chọn không vượt quá ${vote.body.minLength} ký tự`,
    }),
  options: z.array(
    z
      .string()
      .min(vote.options.minLength, {
        message: `Tùy chọn cuộc bình chọn phải có ít nhất ${vote.options.minLength} ký tự`,
      })
      .max(vote.options.maxLength, {
        message: `Tùy chọn cuộc bình chọn không vượt quá ${vote.options.minLength} ký tự`,
      })
  ),
});

const CreateVoteModal = () => {
  const [name, setName] = useState('');
  const [open, setOpen] = useCreateVoteModal();

  const router = useRouter();

  const { mutate: createVote, isPending: voteCreating } = useCreateVote();
  const { data: user } = useCurrentUser();

  const workspaceId = useWorkspaceId();

  const handleClose = () => {
    setOpen(false);
    form.reset();
    setName('');
  };

  const form = useForm<z.infer<typeof createLivePollSchema>>({
    resolver: zodResolver(createLivePollSchema),
    defaultValues: {
      body: '',
      options: ['lựa chọn 1'],
      ownerId: user?._id || '',
      workspaceId: workspaceId || '',
    },
    mode: 'onSubmit',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const onSubmit = async (values: z.infer<typeof createLivePollSchema>) => {
    if (!user) {
      return;
    }
    const finalValues = {
      ...values,
      ownerId: user._id,
      workspaceId: workspaceId,
    };

    createVote(finalValues, {
      onSuccess() {
        toast.success('Bình chọn đã được tạo đã được tạo!');
        router.push(`/workspace/${workspaceId}/votes`);
        handleClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>Tạo cuộc bình chọn</DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="body"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Câu hỏi</FormLabel>

                  <FormControl>
                    <TextWithCounter
                      disabled={false}
                      placeholder="ví dụ: Màu sắc yêu thích của bạn là gì?"
                      maxLength={vote.body.maxLength}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="error-msg">
                    {form.formState.errors.body?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <div role="list" className="mt-2 space-y-4">
              <FormLabel className="block">
                Lựa chọn (tối đa {vote.options.maxCount})
              </FormLabel>

              <FormMessage className="error-msg">
                {form.formState.errors.options?.root?.message}
              </FormMessage>

              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  name={`options.${index}`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex gap-x-2 items-center">
                          <span className="grow-0">{index + 1}.</span>
                          <Input
                            className="w-96 ml-auto"
                            placeholder="ví dụ: Màu xanh"
                            maxLength={vote.options.maxLength}
                            {...field}
                          />

                          <Button
                            size={'sm'}
                            type="button"
                            variant={'outline'}
                            disabled={false}
                            onClick={() => remove(index)}
                          >
                            <Trash size={12} />
                          </Button>
                        </div>
                      </FormControl>

                      <FormMessage className="error-msg">
                        {form.formState.errors.options?.[index]?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              ))}

              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant={'outline'}
                  size={'sm'}
                  disabled={false || fields.length >= vote.options.maxCount}
                  className="mt-4"
                  onClick={() => append(`lựa chọn ${fields.length + 1}`)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm lựa chọn
                </Button>
              </div>
            </div>

            <Button disabled={false} type="submit" className="w-full mt-4">
              {false ? 'Đang tạo cuộc bình chọn...' : 'Tạo cuộc bình chọn'}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVoteModal;
