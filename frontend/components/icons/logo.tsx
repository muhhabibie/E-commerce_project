import Image from "next/image";

interface LogoIconProps {
  className?: string;
}

const LogoIcon = ({ className }: LogoIconProps) => {
  return <Image src={"/logo.svg"} alt="Logo" className={`${className}`} fill />;
};

export default LogoIcon;
