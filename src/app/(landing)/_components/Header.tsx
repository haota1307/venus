'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Lobster } from 'next/font/google';
import Link from 'next/link';
import { ModeToggle } from '@/components/ModeToggle';

const font = Lobster({
  subsets: ['latin'],
  weight: ['400'],
});

const Header = () => {
  return (
    <header className="flex items-center justify-between p-6 bg-white dark:bg-black">
      <div className="hidden md:flex items-center gap-x-2">
        <p
          className={cn(
            'text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text',
            font.className
          )}
        >
          Venus
        </p>
      </div>
      <div className="flex items-center justify-center gap-x-4">
        <Link href="/auth">
          <Button variant="ghost" className="transition duration-300">
            Đăng nhập
          </Button>
        </Link>
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
