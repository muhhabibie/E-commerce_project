import Image from "next/image";

interface SlantedImageProps {
  src: string;
  alt: string;
  className?: string;
}

const SlantedImageCard = ({ src, alt, className }: SlantedImageProps) => {
  return (
    <div
      className={`relative lg:h-[200px] lg:w-[300px] h-[150] w-[250] rounded-[32px] overflow-hidden ${
        className ?? ""
      }`}
    >
      {/* anak yang di-clip jadi trapesium */}
      <div
        className="relative h-full w-full"
        style={{
          clipPath: "polygon(15% 0, 85% 0, 100% 100%, 0 100%)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          quality={100}
          sizes="(max-width: 768px) 100vw, 514px"
          className="object-cover scale-[1.1]"
        />
      </div>
    </div>
  );
};

export default SlantedImageCard;
