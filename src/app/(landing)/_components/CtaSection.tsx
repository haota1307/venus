'use client';

import { useRef } from 'react';
import { useIntersection } from 'react-use';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  const ref = useRef(null);
  const intersection = useIntersection(ref, {
    root: null,
    rootMargin: '0px',
    threshold: 0.2,
  });
  const isInView = intersection?.isIntersecting;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={`max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 p-1 transition-all duration-700 ${isInView ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}
        >
          <div className="bg-white dark:bg-gray-900 rounded-[1.4rem] p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500">
              Sẵn sàng nâng cao hiệu quả giao tiếp của nhóm bạn?
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Đăng ký miễn phí ngay hôm nay và khám phá cách Venus có thể giúp
              nhóm của bạn kết nối và cộng tác hiệu quả hơn.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/25 dark:shadow-fuchsia-900/20 px-8"
                >
                  Bắt đầu miễn phí
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 px-8"
                >
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-gradient-to-br from-purple-200 to-fuchsia-200 dark:from-purple-900/20 dark:to-fuchsia-900/20 rounded-full blur-3xl opacity-50 -z-10"></div>
    </section>
  );
};

export default CtaSection;
