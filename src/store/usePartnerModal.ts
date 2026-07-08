import { create } from "zustand";

interface PartnerModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const usePartnerModal = create<PartnerModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
