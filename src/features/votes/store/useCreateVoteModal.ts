import { atom, useAtom } from 'jotai';

const modalState = atom(false);

export const useCreateVoteModal = () => {
  return useAtom(modalState);
};
