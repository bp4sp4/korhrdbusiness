import { create } from "zustand";

interface CounselModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useCounselModal = create<CounselModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
