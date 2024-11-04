'use client';

import React from 'react';
import CreateWorkspaceModal from '@/features/workspaces/components/CreateWorkspaceModal';
import { useEffect, useState } from 'react';
import CreateChannelModal from '@/features/channels/components/CreateChannelModal';
import CreateVoteModal from '@/features/votes/components/CreateVoteModal';

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
      <CreateVoteModal />
    </>
  );
};

export default Modals;
