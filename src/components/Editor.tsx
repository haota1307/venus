import React, { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ALargeSmall, Image, SendHorizonal, Smile } from 'lucide-react';

import Quill, { type QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import 'quill/dist/quill.snow.css';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Hint } from '@/components/hint';
import { Separator } from '@/components/ui/separator';

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
    const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [['bold', 'italic', 'strike'], ['link'], [{ list: 'ordered' }, { list: 'bullet' }]],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;

                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

                if (isEmpty) return;

                const body = JSON.stringify(quill.getContents());

                submitRef.current?.({ image: addedImage, body });
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

    const saveButton = document.querySelector('.ql-action') as HTMLElement; // Ép kiểu thành HTMLElement
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

  const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm bg-white transition">
        <div ref={containerRef} className="h-full ql-custom" />

        <div className="flex px-2 pb-2">
          <Hint label={isToolbarVisible ? 'Mở thanh định dạng' : 'Ẩn thanh định dạng'}>
            <Button disabled={false} size={'iconSm'} variant={'ghost'} onClick={toggleToolbar}>
              <ALargeSmall className="size-4" />
            </Button>
          </Hint>

          <Hint label="Biểu tượng cảm xúc">
            <Button disabled={false} size={'iconSm'} variant={'ghost'} onClick={() => {}}>
              <Smile className="size-4" />
            </Button>
          </Hint>

          {variant === 'create' && (
            <Hint label="Hình ảnh">
              <Button disabled={false} size={'iconSm'} variant={'ghost'} onClick={() => {}}>
                <Image className="size-4" />
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
                disabled={disable || isEmpty}
                size={'iconSm'}
                onClick={() => {}}
              >
                <SendHorizonal className="size-4" />
              </Button>
            </Hint>
          )}

          {variant === 'update' && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button variant={'secondary'} size={'sm'} onClick={() => {}} disabled={false}>
                Huỷ
              </Button>
              <Button
                variant={'secondary'}
                size={'sm'}
                onClick={() => {}}
                disabled={disable || isEmpty}
                className={cn('bg-green-600 hover:bg-green-600/80 text-white')}
              >
                Lưu
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-1 text-[10px] text-muted-foreground flex justify-end items-center">
        {!isEmpty && (
          <>
            <p>
              <strong>Enter</strong> để gửi
            </p>
            <Separator orientation="vertical" className="mx-2 h-3" />
          </>
        )}
        <p>
          <strong>Shift + Enter</strong> để xuống hàng
        </p>
      </div>
    </div>
  );
};

export default Editor;
