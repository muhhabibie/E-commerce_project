import Image from "next/image";

const Coins = () => {
  return (
    <>
      <Image
        src={"/images/coins.png"}
        alt="Foto koin"
        width={300}
        height={300}
        className="lg:size-[384px] md:size-[300px] size-[250px] object-contain absolute"
      />
    </>
  );
};

export default Coins;
