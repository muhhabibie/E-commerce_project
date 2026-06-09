"use client";
import Clock from "@/components/icons/clock-icon";
import LocationIcon from "@/components/icons/location";
import RightArrow from "@/components/icons/right-arrow";
import Telephone from "@/components/icons/telephone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import useGetUser from "@/hooks/auth/use-get-user";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import DialogLogin from "@/components/shared/dialog-login";
import DialogSignup from "@/components/shared/dialog-signup";
import DialogLoginEmail from "@/components/shared/dialog-login-email";
import { useRouter } from "next/navigation";
import { useGlobalChat } from "@/hooks/chat/use-global-chat";

type AsideCardContent = {
  icon: React.ReactElement;
  title: string;
  description: string;
};

const AsideCard = ({
  className,
  location,
  merchantId,
  merchantUserId,
}: {
  className?: string;
  location?: string;
  merchantId: string;
  merchantUserId?: string;
}) => {
  const router = useRouter();
  const { data: user } = useGetUser();
  const { openChat } = useGlobalChat();
  const {
    openModal,
    defaultModalIsOpen,
    closeModal,
    signInIsOpen,
    signUpIsOpen,
    onCloseSignup,
  } = useOpenModal();
  const isAuthenticated = !!user;

  const handleChatClick = () => {
    if (!isAuthenticated) {
      openModal("default");
      return;
    }
    
    // Check if on desktop (width >= 768px)
    if (window.innerWidth >= 768) {
      openChat(merchantUserId || merchantId);
    } else {
      router.push(`/chat/${merchantId}`);
    }
  };

  const asideCardContent: AsideCardContent[] = [
    {
      icon: <Telephone className="text-secondary" />,
      title: "Telepon",
      description: "081222122",
    },
    {
      icon: <LocationIcon className="text-transparent" />,
      title: "Lokasi",
      description: location ?? "Merchant ini tidak menyediakan lokasi",
    },
    {
      icon: <Clock className="text-secondary" />,
      title: "Jam Operasional",
      description: "08:00 - 22:00",
    },
  ];
  return (
    <Card className={`${className}`}>
      <CardContent className="p-5 md:p-6">
        <h1 className="text-lg md:text-xl lg:text-[22px] font-bold mb-4">
          Informasi Kontak
        </h1>
        {asideCardContent.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-start gap-3 md:gap-4">
              <div className="p-2 md:p-2.5 bg-[#FFF7ED] rounded-xl flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xs md:text-sm lg:text-base text-[#8D8D8D] mb-1">
                  {item.title}
                </h1>
                <p className="text-sm md:text-base break-words">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#E1E1E1] my-4" />
          </div>
        ))}
        <Button
          onClick={handleChatClick}
          className="px-5 md:px-6 py-5 md:py-6 gap-2.5 flex items-center group hover:shadow-[2px_4px_10px_0_rgba(233,109,0,0.4)] hover:bg-[linear-gradient(86deg,#FD6700_4.98%,#FF944B_94.22%)] overflow-hidden mx-auto w-full mt-2"
        >
          <div>
            <p className="text-lg md:text-xl lg:text-2xl">Chat Sekarang!</p>
          </div>

          <div className="p-2 bg-white rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:translate-x-2.5 ">
            <RightArrow className="w-4 h-4 text-primary" />
          </div>
        </Button>
      </CardContent>

      {/* Dialog Login */}
      <DialogLogin
        open={defaultModalIsOpen}
        onClose={closeModal}
        openModal={openModal}
      />
      <DialogSignup open={signUpIsOpen} onClose={onCloseSignup} />
      <DialogLoginEmail open={signInIsOpen} onClose={closeModal} />
    </Card>
  );
};

export default AsideCard;
