import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { TriangleAlert } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AuthFlow } from '@/features/auth/types';

interface SignInCardProps {
  setState: (state: AuthFlow) => void;
}

const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);

    signIn('password', { email, password, flow: 'signIn' })
      .catch(() => {
        setError('Email hoặc mật khẩu không đúng');
      })
      .finally(() => {
        setPending(false);
      });
  };

  const onProviderSignIn = (value: 'github' | 'google') => {
    setPending(true);
    signIn(value, { redirectTo: '/setup' }).finally(() => {
      setPending(false);
    });
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Đăng nhập để tiếp tục</CardTitle>
        <CardDescription>Chọn cách đăng nhập của bạn</CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        {/* <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Tiếp tục
          </Button>
        </form>
        <Separator className="w-full" /> */}
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => onProviderSignIn('google')}
            variant="outline"
            size="lg"
            className="relative w-full"
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Tiếp tục với Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => onProviderSignIn('github')}
            variant="outline"
            size="lg"
            className="relative w-full"
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Tiếp tục với Github
          </Button>
        </div>
        {/* <p className="text-xs text-muted-foreground">
          Bạn chưa có tài khoản?
          <span
            onClick={() => setState('signUp')}
            className="text-fuchsia-700 hover:underline cursor-pointer pl-1"
          >
            Đăng ký
          </span>
        </p> */}
      </CardContent>
    </Card>
  );
};

export default SignInCard;
