'use client';

import React from 'react';
import CreateWorkspaceModal from '@/features/workspaces/components/CreateWorkspaceModal';
import { useEffect, useState } from 'react';

const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};

export default Modals;
