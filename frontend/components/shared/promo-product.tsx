import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Store from "../icons/store";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import Discount from "../icons/discount";
import { DisplayMerchantType } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PromoProductProps {
  merchant?: DisplayMerchantType;
}

import { playHapticFeedback } from "@/lib/haptic";

const PromoProduct = ({ merchant }: PromoProductProps) => {
  const router = useRouter();

  const merchantName = merchant?.name || "Warung makan bu siti";
  const merchantPhoto = merchant?.profilePhotoUrl || "/images/promo-img.png";
  const merchantId = merchant?.id || "1";

  // Check if merchant has real stocks from the database
  const hasRealStocks = merchant?.stocks && merchant.stocks.length > 0;
  const stockItem = hasRealStocks ? merchant.stocks![0] : null;

  // 1. Product Title/Name
  const promoMenus = [
    "Es buah campur",
    "Ayam Bakar",
    "Shampoo",
    "Mie Goreng",
    "Nasi Uduk",
    "Sate Ayam",
    "Bakso Spesial",
    "Gado-Gado",
    "Nasi Campur",
    "Ayam Geprek",
  ];
  const randomMenu = promoMenus[Math.floor(Math.random() * promoMenus.length)];
  const productName = stockItem?.name || randomMenu;

  // 2. Product Image
  const productPhoto = stockItem?.photo_url || merchantPhoto;

  // 3. Distance & Time (Deterministic based on merchant ID so it matches Explore section)
  const idNum = merchant?.id ? parseInt(merchant.id.slice(-4), 16) : 0;
  const displayDistance = merchant?.id ? (idNum % 15 + 1).toFixed(1) + " km" : "1.20 km";
  const timeBase = merchant?.id ? (idNum % 20 + 5) : 10;
  const displayTime = `${timeBase}-${timeBase + 10} menit`;

  // 4. Discount (Deterministic based on stock/merchant ID so it remains stable on refresh)
  const seedString = stockItem?.id || merchantId;
  const seedNum = seedString.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const discount = (seedNum % 16) + 15; // 15% to 30% stable discount

  // 5. Prices
  const originalPrice = stockItem ? stockItem.price : (merchant?.minPrice || Math.floor(Math.random() * 50000) + 30000);
  const promoPrice = Math.floor(originalPrice * (1 - discount / 100));

  // 6. Remaining Stock
  const stock = stockItem ? stockItem.quantity : Math.floor(Math.random() * 15) + 5;
  const maxStockCapacity = stockItem ? Math.max(stockItem.quantity * 2, 20) : 20;
  const stockPercent = Math.min((stock / maxStockCapacity) * 100, 100);

  const handlePromoClick = () => {
    playHapticFeedback("medium");
    router.push(`/merchant/${merchantId}`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    playHapticFeedback("success");

    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("qoin.cart");
        let currentCart: any[] = [];
        if (raw) {
          currentCart = JSON.parse(raw);
          if (!Array.isArray(currentCart)) currentCart = [];
        }

        const itemId = stockItem?.id || merchantId;
        const existingIdx = currentCart.findIndex((item) => item.id === itemId);
        
        if (existingIdx !== -1) {
          currentCart[existingIdx] = {
            ...currentCart[existingIdx],
            price: promoPrice,
            quantity: currentCart[existingIdx].quantity + 1,
          };
        } else {
          currentCart.push({
            id: itemId,
            name: productName,
            price: promoPrice,
            photo_url: productPhoto,
            quantity: 1,
          });
        }

        window.localStorage.setItem("qoin.cart", JSON.stringify(currentCart));
        toast.success(`${productName} ditambahkan ke keranjang dengan Harga Promo! 🛒`);
      } catch (err) {
        console.error("Gagal menambahkan item promo ke cart:", err);
      }
    }

    router.push(`/payment/${merchantId}`);
  };

  return (
    <Card
      onClick={handlePromoClick}
      className="p-0 rounded-[20px] overflow-hidden group hover:shadow-xl hover:-translate-y-1.5 active:translate-y-[1px] active:scale-[0.98] border hover:border-primary/20 transition-all duration-200 ease-out cursor-pointer flex flex-col h-full bg-white"
    >
      <CardHeader className="p-0 relative overflow-hidden h-[120px] md:h-[150px] lg:h-[180px]">
        <Image
          src={productPhoto}
          alt={productName}
          width={251}
          height={251}
          className="w-full h-full object-cover overflow-hidden group-hover:scale-[117%] transition-all duration-500"
        />

        <Badge className="bg-[linear-gradient(285deg,#FFC684_32.21%,#FFE5AC_54.97%,#FFCE96_74.75%)] absolute top-2 left-2 text-secondary font-bold text-xs md:text-sm border-0 shadow-sm">
          <Discount className="" />
          <p>Hemat {discount}%</p>
        </Badge>
      </CardHeader>
      <CardContent className="px-3 py-2.5 md:px-4 md:py-3 flex-1 flex flex-col gap-2">
        <div className="text-[#8D8D8D] flex items-center gap-2">
          <p className="text-xs md:text-sm">{displayDistance}</p>
          <p className="text-sm md:text-base">•</p>
          <p className="text-xs md:text-sm">{displayTime}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Store className="w-3 md:w-3.5 flex-shrink-0" />
            <p className="text-xs md:text-sm text-[#8D8D8D] truncate">
              {merchantName}
            </p>
          </div>
          <CardTitle className="text-sm md:text-base font-semibold text-start truncate">
            {productName}
          </CardTitle>
        </div>
        <div className="space-y-0.5 text-start">
          <p className="text-xs md:text-sm font-semibold text-[#8D8D8D] line-through">
            Rp. {originalPrice.toLocaleString("id-ID")}
          </p>
          <p className="text-primary font-bold text-sm md:text-base lg:text-lg">
            Rp. {promoPrice.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="flex gap-2 items-center mt-auto">
          <Progress value={stockPercent} className="flex-1 bg-[#E1E1E1]" />
          <p className="text-xs md:text-sm text-primary font-semibold whitespace-nowrap">
            {stock} Tersisa
          </p>
        </div>
      </CardContent>
      <CardAction className="mx-auto pb-2.5 md:pb-3 px-3 md:px-4 w-full">
        <Button 
          onClick={handleBuyNow}
          className="w-full font-semibold text-xs md:text-sm lg:text-base py-2"
        >
          Beli Sekarang
        </Button>
      </CardAction>
    </Card>
  );
};

export default PromoProduct;
