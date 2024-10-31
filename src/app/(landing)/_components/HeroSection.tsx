import { Button } from '@/components/ui/button';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
});

const HeroSection = () => {
  return (
    <section className="relative w-full flex flex-col items-center justify-center text-center dark:bg-black py-40 text-white">
      <h1
        className={`text-5xl md:text-6xl font-extrabold leading-tight ${font.className}`}
      >
        <span className="text-black dark:text-white">Trò chuyện cùng {''}</span>
        <span className="text-fuchsia-900">Venus</span>
      </h1>
      <p className="mt-4 max-w-xl text-black dark:text-white">
        Chào mừng bạn đến với Venus. Nơi mọi người có thể thỏa sức trò chuyện
        bàn bạc về công việc
      </p>
      <Link href="/auth" className="z-50">
        <Button
          variant="default"
          size="lg"
          className="mt-8 bg-fuchsia-800 hover:bg-fuchsia-700 text-white z-50 transition duration-300"
        >
          Bắt đầu ngay
        </Button>
      </Link>
      <Image
        src="./marketing.svg"
        alt="Hero Image"
        width={600}
        height={600}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 dark:hidden opacity-15 select-none"
      />
      <Image
        src="./marketing-dark.svg"
        alt="Hero Image"
        width={600}
        height={600}
        className="hidden dark:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-15 select-none"
      />
    </section>
  );
};

export default HeroSection;
