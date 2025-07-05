'use client';

import { useRef } from 'react';
import { useIntersection } from 'react-use';
import Image from 'next/image';

// Testimonial card component
const TestimonialCard = ({
  content,
  author,
  position,
  avatarUrl,
  delay,
}: {
  content: string;
  author: string;
  position: string;
  avatarUrl: string;
  delay: string;
}) => {
  const ref = useRef(null);
  const intersection = useIntersection(ref, {
    root: null,
    rootMargin: '0px',
    threshold: 0.2,
  });
  const isInView = intersection?.isIntersecting;

  return (
    <div
      ref={ref}
      className={`bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md transition-all duration-700 ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${delay} h-full`}
    >
      {/* Quote icon */}
      <div className="mb-6">
        <svg
          width="45"
          height="36"
          className="text-fuchsia-200 dark:text-fuchsia-900"
          viewBox="0 0 45 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5 0C6.04125 0 0 6.04125 0 13.5C0 20.9588 6.04125 27 13.5 27C20.9588 27 27 20.9588 27 13.5C27 6.04125 20.9588 0 13.5 0ZM42.75 0C35.2912 0 29.25 6.04125 29.25 13.5C29.25 20.9588 35.2912 27 42.75 27C43.0388 27 43.3275 27 43.6162 26.9587C41.4 31.5 37.5338 34.8862 33.75 36V31.5C33.75 29.7225 32.2763 28.125 30.375 28.125C25.6275 28.125 22.5 24.8737 22.5 20.25V13.5C22.5 6.04125 28.5412 0 36 0H42.75Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Testimonial content */}
      <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
        &ldquo;{content}&rdquo;
      </p>

      {/* Author info */}
      <div className="flex items-center">
        <div className="mr-4 rounded-full overflow-hidden w-12 h-12 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          <Image
            src={avatarUrl}
            alt={`Avatar của ${author}`}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">
            {author}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{position}</p>
        </div>
      </div>
    </div>
  );
};

// Main testimonials section
const TestimonialsSection = () => {
  const ref = useRef(null);
  const intersection = useIntersection(ref, {
    root: null,
    rootMargin: '0px',
    threshold: 0.2,
  });
  const isInView = intersection?.isIntersecting;

  const testimonials = [
    {
      content:
        'Venus đã thay đổi hoàn toàn cách nhóm của chúng tôi giao tiếp. Giờ đây mọi thành viên đều được cập nhật và kết nối tốt hơn, kể cả khi làm việc từ xa.',
      author: 'Nguyễn Minh Tâm',
      position: 'Giám đốc dự án, TechViet',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      delay: 'delay-[200ms]',
    },
    {
      content:
        'Chất lượng video call của Venus thực sự ấn tượng. Các cuộc họp trực tuyến của chúng tôi giờ đây diễn ra mượt mà và không bị gián đoạn.',
      author: 'Trần Hoài An',
      position: 'Quản lý nhóm, GrowthLab',
      avatarUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop',
      delay: 'delay-[400ms]',
    },
    {
      content:
        'Việc quản lý các kênh và cuộc hội thoại chưa bao giờ đơn giản đến thế. Venus giúp tôi tiết kiệm rất nhiều thời gian trong việc điều phối nhóm.',
      author: 'Lê Quang Trung',
      position: 'Product Manager, InnoSpace',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      delay: 'delay-[600ms]',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gray-50 dark:bg-gray-900/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <h2 className="inline-block px-4 py-1 mb-4 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-800 dark:text-fuchsia-300 text-sm font-medium">
            ĐÁNH GIÁ
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Người dùng nói gì về{' '}
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
              Venus
            </span>
          </h3>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            Khám phá trải nghiệm của những người đã và đang sử dụng nền tảng
            Venus mỗi ngày
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              position={testimonial.position}
              avatarUrl={testimonial.avatarUrl}
              delay={testimonial.delay}
            />
          ))}
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-fuchsia-200 dark:bg-fuchsia-900/20 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 -z-10"></div>
    </section>
  );
};

export default TestimonialsSection;
