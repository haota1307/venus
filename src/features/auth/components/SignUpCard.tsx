import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { TriangleAlert } from 'lucide-react';

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
import { useAuthActions } from '@convex-dev/auth/react';
import { ConvexError } from 'convex/values';
import { useCheckEmailExists } from '@/features/auth/components/api/useCheckEmailExists';

interface SignUpCardProps {
  setState: (state: AuthFlow) => void;
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const { data: emailExists, isCheckingEmail } = useCheckEmailExists(email);

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }

    if (emailExists) {
      setError('Email này đã được sử dụng');
      return;
    }

    setPending(true);

    signIn('password', { name, email, password, flow: 'signUp' })
      .catch((err) => {
        throw new ConvexError(err);
      })
      .finally(() => {
        setPending(false);
      });
  };

  const onProviderSignUp = (value: 'github' | 'google') => {
    setPending(true);
    signIn(value, { redirectTo: '/' }).finally(() => {
      setPending(false);
    });
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Đăng ký để tiếp tục</CardTitle>
        <CardDescription>
          Sử dụng email của bạn hoặc dịch vụ khác để tiếp tục
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên của bạn"
            type="text"
            required
          />
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
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            Tiếp tục
          </Button>
        </form>
        <Separator className="w-full" />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp('google')}
            variant="outline"
            size="lg"
            className="relative w-full"
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Tiếp tục với Google
          </Button>
          <Button
            disabled={pending}
            onClick={() => onProviderSignUp('github')}
            variant="outline"
            size="lg"
            className="relative w-full"
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Tiếp tục với Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Bạn đã có tài khoản?
          <span
            onClick={() => setState('signIn')}
            className="text-fuchsia-700 hover:underline cursor-pointer pl-2"
          >
            Đăng nhập
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
