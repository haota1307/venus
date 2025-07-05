'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Lobster } from 'next/font/google';
import Link from 'next/link';
import { ModeToggle } from '@/components/ModeToggle';
import Image from 'next/image';

const font = Lobster({
  subsets: ['latin'],
  weight: ['400'],
});

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Venus Logo" width={32} height={32} />
          <span
            className={cn(
              'text-3xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text',
              font.className
            )}
          >
            Venus
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-gray-600 hover:text-fuchsia-600 dark:text-gray-300 dark:hover:text-fuchsia-400 transition-colors"
          >
            Tính năng
          </Link>
          <Link
            href="#about"
            className="text-gray-600 hover:text-fuchsia-600 dark:text-gray-300 dark:hover:text-fuchsia-400 transition-colors"
          >
            Về chúng tôi
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth" className="hidden sm:block">
            <Button
              variant="outline"
              className="border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-white transition-colors"
            >
              Đăng nhập
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-white shadow-md shadow-fuchsia-200 dark:shadow-fuchsia-900/20">
              Bắt đầu ngay
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
