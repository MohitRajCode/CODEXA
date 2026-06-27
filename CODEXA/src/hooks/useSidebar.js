import { create } from 'zustand';

const useSidebar = create((set) => ({
  isOpen: true,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  close:  () => set({ isOpen: false }),
  open:   () => set({ isOpen: true }),
}));

export default useSidebar;
