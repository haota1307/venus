'use client';
import { useRef } from 'react';
import { useIntersection } from 'react-use';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const StatItem = ({ number, label }: { number: string; label: string }) => {
  return (
    <div className="text-center px-4">
      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text mb-2">
        {number}
      </div>
      <div className="text-gray-600 dark:text-gray-400 text-sm">{label}</div>
    </div>
  );
};

const IntroSection = () => {
  const ref = useRef(null);
  const intersection = useIntersection(ref, {
    root: null,
    rootMargin: '0px',
    threshold: 0.2,
  });
  const isInView = intersection?.isIntersecting;

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left image column */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-[400px] md:h-[500px] w-full max-w-[500px] mx-auto">
              {/* Decorative elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Main image frame */}
                <div className="relative w-[80%] h-[80%] rounded-2xl overflow-hidden border-8 border-white dark:border-gray-800 shadow-xl z-10">
                  <Image
                    src="/logo.svg"
                    alt="Venus Team"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Decorative colored squares */}
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-purple-200 dark:bg-purple-900/30 rounded-lg rotate-12 z-0"></div>
                <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-fuchsia-200 dark:bg-fuchsia-900/30 rounded-lg -rotate-12 z-0"></div>
              </div>
            </div>
          </div>

          {/* Right content column */}
          <div
            ref={ref}
            className={`w-full lg:w-1/2 transition-all duration-700 ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-800 dark:text-fuchsia-300 text-sm font-medium">
              VỀ CHÚNG TÔI
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Sứ mệnh của{' '}
              <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
                Venus
              </span>{' '}
              là kết nối mọi người
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Venus được phát triển với mục tiêu tạo ra một nền tảng giao tiếp
              hiện đại, dễ sử dụng và hiệu quả. Chúng tôi tin rằng kết nối và
              cộng tác là chìa khóa để mọi người cùng nhau phát triển và thành
              công.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Với sự kết hợp giữa công nghệ tiên tiến và thiết kế hướng người
              dùng, Venus mang đến trải nghiệm trò chuyện và làm việc nhóm liền
              mạch giúp nâng cao hiệu suất và sự gắn kết.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-10">
              <StatItem number="10K+" label="Người dùng" />
              <StatItem number="5M+" label="Tin nhắn mỗi ngày" />
              <StatItem number="120+" label="Quốc gia" />
            </div>

            <Link href="/auth">
              <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-white shadow-md shadow-fuchsia-500/25 dark:shadow-fuchsia-900/20">
                Khám phá Venus ngay
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -top-40 left-1/4 w-72 h-72 bg-purple-100 dark:bg-purple-900/10 rounded-full blur-3xl opacity-50"></div>
    </section>
  );
};

export default IntroSection;
