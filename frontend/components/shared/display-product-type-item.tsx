import Image from "next/image";

interface DisplayProductTypeItemProps {
  img: string;
  title: string;
}

const DisplayProductTypeItem = ({
  img,
  title,
}: DisplayProductTypeItemProps) => {
  return (
    <div className="relative rounded-[35px] overflow-hidden group">
      <Image
        src={img}
        alt={title}
        width={100}
        height={100}
        className="w-full h-full object-cover rounded-[35px] group-hover:scale-[117%] transition-all duration-500"
      />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(184,75,0,0)_36.35%,rgba(184,75,0,0.8)_100%)]" />

      {/* Teks di paling atas, posisi bawah-tengah */}
      <p className="absolute inset-x-0 bottom-3 z-[100] text-white text-start px-8 drop-shadow-md lg:text-[28px] text-xl">
        {title}
      </p>
    </div>
  );
};

export default DisplayProductTypeItem;
