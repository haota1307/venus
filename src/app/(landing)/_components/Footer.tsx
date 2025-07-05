import Link from 'next/link';
import { Lobster } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Github, Twitter, Instagram, Linkedin } from 'lucide-react';

const font = Lobster({
  subsets: ['latin'],
  weight: ['400'],
});

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Top section with links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span
                className={cn(
                  'text-2xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text',
                  font.className
                )}
              >
                Venus
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Nền tảng giao tiếp hiện đại giúp kết nối và cộng tác hiệu quả cho
              mọi đội nhóm.
            </p>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Sản phẩm
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 text-sm"
                >
                  Tính năng
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 text-sm"
                >
                  Bảng giá
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 text-sm"
                >
                  Hỗ trợ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 text-sm"
                >
                  Tài liệu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Công ty
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#about"
                  className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 text-sm"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 text-sm"
                >
                  Đội ngũ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 text-sm"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 text-sm"
                >
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Pháp lý
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 text-sm"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 text-sm"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 text-sm"
                >
                  Cookie
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with social and copyright */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Venus. Đã đăng ký bản quyền.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-fuchsia-500 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-fuchsia-500 transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-fuchsia-500 transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-fuchsia-500 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
