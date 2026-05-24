"use client";

import DiscountSection from "@/components/section/discount-section";
import DisplayProductType from "@/components/section/display-product-type";
import ExploreSection from "@/components/section/explore-section";
import Footer from "@/components/section/footer";
import Header from "@/components/section/header";
import HeroSection from "@/components/section/hero-section";
import ImageHero from "@/components/section/image-hero";
import InspiratedSection from "@/components/section/inspired-section";
import TestimonialSection from "@/components/section/testimonial-section";
import CallingAction from "@/components/shared/calling-action";
import DialogLogin from "@/components/shared/dialog-login";
import DialogLoginEmail from "@/components/shared/dialog-login-email";
import DialogSignup from "@/components/shared/dialog-signup";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import useGetDisplayMerchant from "@/hooks/merchant/use-get-display-merchant";
import { motion } from "framer-motion";

export default function Home() {
  const {
    closeModal,
    openModal,
    onCloseSignup,
    signUpIsOpen,
    defaultModalIsOpen,
    signInIsOpen,
  } = useOpenModal();

  const { displayMerchant, isLoading: merchantIsLoading } =
    useGetDisplayMerchant();

  return (
    <>
      <Header openModal={openModal} />
      <HeroSection />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <ImageHero isBlank />
      </motion.div>
      <DisplayProductType />
      <ExploreSection
        displayMerchant={displayMerchant}
        displayMerchantLoading={merchantIsLoading}
      />
      <ImageHero />
      {/* <LastSearch /> */}
      <DiscountSection
        displayMerchant={displayMerchant}
        displayMerchantLoading={merchantIsLoading}
      />
      <TestimonialSection />
      <InspiratedSection />
      <ImageHero isExplore />
      <CallingAction openModal={openModal} />

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
}
