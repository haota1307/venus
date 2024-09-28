'use client';

import { useState } from 'react';

import { AuthFlow } from '@/features/auth/types';
import SignInCard from '@/features/auth/components/SignInCard';
import SignUpCard from '@/features/auth/components/SignUpCard';

const AuthScreen = () => {
  const [state, setState] = useState<AuthFlow>('signIn');

  return (
    <div className="h-screen flex items-center justify-center bg-indigo-100">
      <div className="md:h-auto md:w-[420px]">
        {state === 'signIn' ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
