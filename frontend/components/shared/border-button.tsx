"use client";

import { Button } from "@/components/ui/button"; // shadcn
import { ComponentProps, ReactNode } from "react";

interface BorderButtonProps extends ComponentProps<typeof Button> {
  icon?: ReactNode;
}

const BorderButton = ({
  className,
  children,
  icon,
  ...props
}: BorderButtonProps) => {
  return (
    <Button
      variant="outline"
      className={`inline-flex items-center border-primary text-secondary hover:text-secondary hover:bg-white cursor-pointer px-4 py-2.5 text-xl font-semibold ${
        className ?? ""
      }`}
      {...props}
    >
      {icon && <span className={`relative w-4 h-4 shrink-0`}>{icon}</span>}
      <span className="font-semibold">{children}</span>
    </Button>
  );
};

export default BorderButton;
