import React from "react";
import { Button } from "../ui/button";

interface PrimaryButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const PrimaryButton = ({
  className,
  children,
  onClick,
  ...props
}: PrimaryButtonProps) => {
  return (
    <Button className={className} onClick={onClick} {...props}>
      {children}
    </Button>
  );
};
export default PrimaryButton;
