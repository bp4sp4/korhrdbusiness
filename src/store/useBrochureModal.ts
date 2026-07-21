import { create } from "zustand";

interface BrochureModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useBrochureModal = create<BrochureModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
