import Image from 'next/image';
import React, {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ALargeSmall,
  ImagePlusIcon,
  SendHorizonal,
  Smile,
  XIcon,
} from 'lucide-react';

import Quill, { type QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import 'quill/dist/quill.snow.css';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Hint } from '@/components/hint';
import { Separator } from '@/components/ui/separator';

import { EmojiPopover } from '@/components/EmojiPopover';

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: ({ body, image }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disable?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: 'create' | 'update';
}

const Editor = ({
  variant = 'create',
  placeholder = 'Nhập gì đó...',
  defaultValue = [],
  disable = false,
  innerRef,
  onSubmit,
  onCancel,
}: EditorProps) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null); // Trạng thái mới cho các tệp không phải hình ảnh
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef(placeholder);
  const defaultValueRef = useRef(defaultValue);
  const quillRef = useRef<Quill | null>(null);
  const submitRef = useRef(onSubmit);
  const disableRef = useRef(disable);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disableRef.current = disable;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div')
    );

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill.getText();
                const addedFile = imageElementRef.current?.files?.[0] || null;

                const isEmpty =
                  !addedFile &&
                  text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());

                submitRef.current?.({ image: addedFile, body });
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n');
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    const saveButton = document.querySelector('.ql-action') as HTMLElement;
    if (saveButton) {
      saveButton.textContent = 'Lưu';
      saveButton.style.paddingLeft = '10px';
      saveButton.style.paddingRight = '10px';
    }

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);

      if (container) {
        container.innerHTML = '';
      }

      if (quillRef.current) {
        quillRef.current = null;
      }

      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');
    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden');
    }
  };

  const onEmojiSelect = (emojiValue: string) => {
    const quill = quillRef.current;

    quill?.insertText(quill.getSelection()?.index || 0, emojiValue);
  };

  const isEmpty =
    !image && !file && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx"
        ref={imageElementRef}
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];
          if (!selectedFile) return;

          if (selectedFile.type.startsWith('image/')) {
            setImage(selectedFile);
            setFile(null); // Đặt lại trạng thái tệp nếu tệp hình ảnh được chọn
          } else {
            setFile(selectedFile);
            setImage(null); // Đặt lại hình ảnh nếu tệp không phải hình ảnh được chọn
          }
        }}
        className="hidden"
      />

      <div
        className={cn(
          'flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm bg-white transition',
          disable && 'opacity-50'
        )}
      >
        <div ref={containerRef} className={cn('h-full ql-custom')} />

        {!!image && (
          <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Bỏ chọn">
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = '';
                  }}
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[5] border-2 border-white items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Hình ảnh được upload"
                fill
                className="rounded-xl overflow-hidden border object-cover"
              />
            </div>
          </div>
        )}

        {!!file && (
          <div className="p-2 flex items-center">
            <Hint label="Bỏ chọn tệp">
              <button
                onClick={() => {
                  setFile(null);
                  imageElementRef.current!.value = '';
                }}
                className="rounded-full bg-black/70 hover:bg-black text-white size-6 border-2 border-white p-1 mr-2"
              >
                <XIcon className="size-3.5" />
              </button>
            </Hint>
            <p className="text-sm">{file.name}</p>
          </div>
        )}

        <div className="flex px-2 pb-2 dark:bg-slate-900/[0.99]">
          <Hint
            label={
              isToolbarVisible ? 'Mở thanh định dạng' : 'Ẩn thanh định dạng'
            }
          >
            <Button
              disabled={false}
              size={'iconSm'}
              variant={'ghost'}
              onClick={toggleToolbar}
            >
              <ALargeSmall className="size-4" />
            </Button>
          </Hint>

          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disable} size="iconSm" variant="ghost">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>

          {variant === 'create' && (
            <Hint label="Hình ảnh">
              <Button
                disabled={false}
                size={'iconSm'}
                variant={'ghost'}
                onClick={() => imageElementRef.current?.click()}
              >
                <ImagePlusIcon className="size-4" />
              </Button>
            </Hint>
          )}

          {variant === 'create' && (
            <Hint label="Gửi tin nhắn">
              <Button
                className={cn(
                  'ml-auto transition-all',
                  isEmpty
                    ? 'bg-white hover:bg-white text-muted-foreground'
                    : 'bg-green-600 hover:bg-green-600/80 text-white'
                )}
                disabled={isEmpty}
                onClick={() => {
                  const addedFile = imageElementRef.current?.files?.[0] || null;
                  const body = JSON.stringify(quillRef.current?.getContents());

                  submitRef.current?.({ image: addedFile, body });
                }}
              >
                <SendHorizonal className="size-4" />
              </Button>
            </Hint>
          )}
        </div>

        <Separator />
      </div>
    </div>
  );
};

export default Editor;
