const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white dark:bg-black text-center">
      <h2 className="text-4xl font-bold text-fuchsia-600 mb-8">
        Tính năng nổi bật
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 md:px-12">
        <div className="p-6 rounded-lg shadow-md bg-fuchsia-100 transition-transform transform hover:scale-105 duration-300">
          <h3 className="text-2xl font-bold mb-4 text-fuchsia-600">
            Trò chuyện thời gian thực
          </h3>
          <p className="text-sm text-gray-700">
            Trải nghiệm trò chuyện liền mạch không độ trễ, cho phép bạn và nhóm
            của mình giao tiếp tức thì để chia sẻ ý tưởng, bàn luận dự án và giữ
            kết nối mọi lúc mọi nơi.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md bg-fuchsia-100 transition-transform transform hover:scale-105 duration-300">
          <h3 className="text-2xl font-bold mb-4 text-fuchsia-600">
            Video call chất lượng cao
          </h3>
          <p className="text-sm text-gray-700">
            Giao tiếp trực diện dễ dàng với các cuộc gọi video chất lượng cao,
            giúp tăng cường sự gắn kết và hiệu quả công việc ngay cả khi làm
            việc từ xa.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md bg-fuchsia-100 transition-transform transform hover:scale-105 duration-300">
          <h3 className="text-2xl font-bold mb-4 text-fuchsia-600">
            Kết nối nhanh chóng với link và mã
          </h3>
          <p className="text-sm text-gray-700">
            Mời đồng nghiệp và bạn bè tham gia vào cuộc trò chuyện hoặc cuộc họp
            chỉ với một đường link và mã ngắn gọn – đơn giản, nhanh chóng và
            tiện lợi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
