import { create } from "zustand";

interface GlobalChatState {
  isOpen: boolean;
  isMinimized: boolean;
  activePartnerId: string | null;
  openChat: (partnerId?: string) => void;
  closeChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
}

export const useGlobalChat = create<GlobalChatState>((set) => ({
  isOpen: false,
  isMinimized: false,
  activePartnerId: null,
  openChat: (partnerId) =>
    set((state) => ({
      isOpen: true,
      isMinimized: false,
      activePartnerId: partnerId ?? state.activePartnerId,
    })),
  closeChat: () =>
    set(() => ({
      isOpen: false,
      activePartnerId: null,
    })),
  minimizeChat: () =>
    set(() => ({
      isMinimized: true,
    })),
  maximizeChat: () =>
    set(() => ({
      isMinimized: false,
    })),
}));
