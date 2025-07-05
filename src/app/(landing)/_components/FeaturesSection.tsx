'use client';

import { useRef } from 'react';
import { useIntersection } from 'react-use';
import {
  MessageSquareText,
  Video,
  Users,
  Zap,
  Shield,
  MessagesSquare,
} from 'lucide-react';

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
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
      className={`transform transition-all duration-700 ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${delay}`}
    >
      <div className="h-full p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow">
        <div className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/30 dark:to-fuchsia-900/30">
          <Icon className="w-7 h-7 text-fuchsia-600 dark:text-fuchsia-400" />
        </div>

        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const ref = useRef(null);
  const intersection = useIntersection(ref, {
    root: null,
    rootMargin: '0px',
    threshold: 0.2,
  });
  const isInView = intersection?.isIntersecting;

  const features = [
    {
      icon: MessageSquareText,
      title: 'Trò chuyện thời gian thực',
      description:
        'Trải nghiệm trò chuyện liền mạch không độ trễ, cho phép bạn và nhóm giao tiếp tức thì để chia sẻ ý tưởng và bàn luận dự án.',
      delay: 'delay-[200ms]',
    },
    {
      icon: Video,
      title: 'Video call chất lượng cao',
      description:
        'Giao tiếp trực diện với các cuộc gọi video chất lượng cao, giúp tăng cường sự gắn kết và hiệu quả công việc ngay cả khi làm việc từ xa.',
      delay: 'delay-[400ms]',
    },
    {
      icon: Users,
      title: 'Kết nối nhanh chóng',
      description:
        'Mời đồng nghiệp và bạn bè tham gia vào cuộc trò chuyện hoặc cuộc họp chỉ với một đường link và mã ngắn gọn.',
      delay: 'delay-[600ms]',
    },
    {
      icon: Shield,
      title: 'Bảo mật tối đa',
      description:
        'Dữ liệu của bạn luôn được bảo vệ với các chuẩn mã hóa cao cấp, đảm bảo riêng tư cho mọi cuộc trò chuyện và tài liệu.',
      delay: 'delay-[800ms]',
    },
    {
      icon: MessagesSquare,
      title: 'Kênh linh hoạt',
      description:
        'Tạo và tổ chức các kênh theo chủ đề, dự án hoặc nhóm làm việc, giúp sắp xếp thông tin hợp lý và dễ tiếp cận.',
      delay: 'delay-[1000ms]',
    },
    {
      icon: Zap,
      title: 'Tối ưu hiệu suất',
      description:
        'Giao diện đơn giản, trực quan và hiệu quả, giúp bạn tập trung vào công việc thay vì phải mất thời gian làm quen với công cụ.',
      delay: 'delay-[1200ms]',
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <h2 className="inline-block px-4 py-1 mb-4 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-800 dark:text-fuchsia-300 text-sm font-medium">
            TÍNH NĂNG
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Tất cả những gì bạn cần để{' '}
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
              kết nối và cộng tác
            </span>
          </h3>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            Venus cung cấp đầy đủ các công cụ cần thiết để bạn tương tác hiệu
            quả trong môi trường làm việc hiện đại.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-fuchsia-100 dark:bg-fuchsia-900/10 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100 dark:bg-purple-900/10 rounded-full blur-3xl opacity-50"></div>
    </section>
  );
};

export default FeaturesSection;
