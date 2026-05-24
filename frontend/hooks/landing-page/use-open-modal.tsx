"use client";

import { useState } from "react";

const useOpenModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState<null | string>(null);

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
