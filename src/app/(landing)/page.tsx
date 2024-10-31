import React from 'react';
import HeroSection from './_components/HeroSection';
import FeaturesSection from './_components/FeaturesSection';
import IntroSection from './_components/IntroSection';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const font = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export default function LandingPage() {
  return (
    <div className={cn(font.className)}>
      <HeroSection />
      <FeaturesSection />
      <IntroSection />
    </div>
  );
}
