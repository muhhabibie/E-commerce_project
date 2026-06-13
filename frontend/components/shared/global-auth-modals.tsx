"use client";

import useOpenModal from "@/hooks/landing-page/use-open-modal";
import DialogLogin from "./dialog-login";
import DialogLoginEmail from "./dialog-login-email";
import DialogSignup from "./dialog-signup";

const GlobalAuthModals = () => {
  const {
    closeModal,
    openModal,
    onCloseSignup,
    signUpIsOpen,
    defaultModalIsOpen,
    signInIsOpen,
  } = useOpenModal();

  return (
    <>
      <DialogLogin
        open={defaultModalIsOpen}
        onClose={closeModal}
        openModal={openModal}
      />
      <DialogLoginEmail
        open={signInIsOpen}
        onClose={closeModal}
      />
      <DialogSignup
        open={signUpIsOpen}
        onClose={onCloseSignup}
      />
    </>
  );
};

export default GlobalAuthModals;
