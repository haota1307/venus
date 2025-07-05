import { Button } from '@/components/ui/button';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-800 dark:text-fuchsia-300 text-sm font-medium">
              💬 Nền tảng giao tiếp hiện đại
            </div>

            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${font.className} mb-6`}
            >
              Trò chuyện và cộng tác cùng{' '}
              <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
                Venus
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Nền tảng trò chuyện trực tuyến giúp kết nối và cộng tác hiệu quả,
              với đầy đủ tính năng từ chat đến video call chất lượng cao.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/25 dark:shadow-fuchsia-900/20 w-full sm:w-auto"
                >
                  Bắt đầu miễn phí
                </Button>
              </Link>
              <a href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 w-full sm:w-auto"
                >
                  Tìm hiểu thêm
                </Button>
              </a>
            </div>

            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              Đã có hơn 10,000+ người dùng tin tưởng
            </div>
          </div>

          {/* Right image */}
          <div className="w-full lg:w-1/2 relative z-0">
            <div className="relative w-full h-[400px] md:h-[500px]">
              {/* Gradient background for the image */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-100 via-fuchsia-50 to-pink-50 dark:from-purple-900/20 dark:via-fuchsia-900/10 dark:to-pink-900/5 opacity-70"></div>

              {/* Main image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/marketing.svg"
                  alt="Venus Chat Platform"
                  width={600}
                  height={600}
                  className="w-[90%] h-auto object-contain dark:hidden"
                  priority
                />
                <Image
                  src="/marketing-dark.svg"
                  alt="Venus Chat Platform"
                  width={600}
                  height={600}
                  className="hidden w-[90%] h-auto object-contain dark:block"
                  priority
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full opacity-30 blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-fuchsia-400 to-pink-400 rounded-full opacity-30 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-fuchsia-300 dark:bg-fuchsia-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </section>
  );
};

export default HeroSection;
