import clsx from "clsx";
import React from "react";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  isFluid?: boolean; // true untuk full-bleed section (banner, carousel besar)
};

const PageContainer = ({
  children,
  className,
  isFluid,
}: PageContainerProps) => {
  if (isFluid) {
    return <div className={clsx("w-full", className)}>{children}</div>;
  }

  return (
    <div
      className={`xl:max-w-[1184px] md:max-w-[1024px] sm:max-w-[768px] mx-auto ${className}`}
    >
      {children}
    </div>
  );
};

export default PageContainer;
