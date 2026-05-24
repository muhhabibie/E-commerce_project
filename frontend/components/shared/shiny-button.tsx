import React from "react";
import { Button } from "../ui/button";
import RightArrow from "../icons/right-arrow";

const ShinyButton = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Button
      className={`shiny-sweep bg-[linear-gradient(276deg,#FFDEB9_93.94%,#FFF8E9_106.5%,#FFE0BC_117.28%)] text-secondary px-[26px] py-6 rounded-[20px] shadow-[0_6px_20px_0_#FFA236] font-semibold lg:text-2xl text-xl overflow-hidden transition-all duration-1000 ${className}`}
      onClick={onClick}
    >
      <div>{children}</div>
      <div className="p-2 bg-[#CB3600] rounded-full text-[#FFDEB9]">
        <RightArrow className="size-3 text-[#FFDEB9]" />
      </div>
    </Button>
  );
};

export default ShinyButton;
