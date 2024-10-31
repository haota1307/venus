import React from 'react';
import Header from './_components/Header';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-50 to-white dark:bg-black">
      <Header />
      <main className="dark:bg-black pt-24">{children}</main>
    </div>
  );
};

export default LandingLayout;
