"use client";

import { create } from "zustand";

interface ModalStore {
  modalIsOpen: string | null;
  setModalIsOpen: (val: string | null) => void;
}

const useModalStore = create<ModalStore>((set) => ({
  modalIsOpen: null,
  setModalIsOpen: (val) => set({ modalIsOpen: val }),
}));

const useOpenModal = () => {
  const { modalIsOpen, setModalIsOpen } = useModalStore();

  const signUpIsOpen = modalIsOpen === "signup";
  const signInIsOpen = modalIsOpen === "signin";
  const defaultModalIsOpen = modalIsOpen === "default";

  const openModal = (open: string) => setModalIsOpen(open);
  const closeModal = () => setModalIsOpen(null);
  const onCloseSignup = () => setModalIsOpen(null);

  return {
    modalIsOpen,
    openModal,
    closeModal,
    signUpIsOpen,
    signInIsOpen,
    defaultModalIsOpen,
    onCloseSignup,
  };
};

export default useOpenModal;
