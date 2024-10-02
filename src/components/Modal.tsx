'use client';

import React from 'react';
import CreateWorkspaceModal from '@/features/workspaces/components/CreateWorkspaceModal';
import { useEffect, useState } from 'react';
import CreateChannelModal from '@/features/channels/components/CreateChannelModal';

const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModal />
    </>
  );
};

export default Modals;
