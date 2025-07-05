import React from 'react';
import Header from './_components/Header';
import Footer from './_components/Footer';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-fuchsia-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-fuchsia-950/10">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
