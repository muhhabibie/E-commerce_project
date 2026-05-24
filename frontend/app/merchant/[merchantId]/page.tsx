"use client";

import Header from "@/components/section/header";
import DialogLogin from "@/components/shared/dialog-login";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import MerchantHeader from "../components/merchant-header";
import MerchantDisplay from "../components/merchant-display";
import DialogSignup from "@/components/shared/dialog-signup";
import DialogLoginEmail from "@/components/shared/dialog-login-email";
import useGetMerchantById from "@/hooks/merchant/use-get-merchant-by-id";
import Footer from "@/components/section/footer";
import useAddProductToCart from "@/hooks/merchant/use-add-product-to-cart";
import MerchantNotFound from "./not-found";

const MerchantPage = () => {
  const {
    closeModal,
    defaultModalIsOpen,
    onCloseSignup,
    openModal,
    signInIsOpen,
    signUpIsOpen,
  } = useOpenModal();

  const { isLoading, merchant } = useGetMerchantById();

  const { handleProduct, cart, increment, decrement, totals } =
    useAddProductToCart();

  if (!isLoading && !merchant) {
    return <MerchantNotFound />;
  }

  return (
    <>
      <Header openModal={openModal} isLoading={isLoading} />
      <MerchantHeader merchant={merchant} isLoading={isLoading} />
      <MerchantDisplay
        merchant={merchant}
        handleProduct={handleProduct}
        cart={cart}
        increment={increment}
        decrement={decrement}
        totals={totals}
      />

      <DialogLogin
        open={defaultModalIsOpen}
        onClose={closeModal}
        openModal={openModal}
      />
      <DialogSignup open={signUpIsOpen} onClose={onCloseSignup} />
      <DialogLoginEmail open={signInIsOpen} onClose={closeModal} />
      <Footer />
    </>
  );
};

export default MerchantPage;
