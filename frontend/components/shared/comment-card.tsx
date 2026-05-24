import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Star from "../icons/star";
import { Badge } from "../ui/badge";
import Like from "../icons/like-icon";

interface CommentCardProps {
  className?: string;
  isReview?: boolean;
  photo?: [];
  userEmail?: string;
  rate?: number;
  comment?: string;
  date?: string;
}

const CommentCard = ({ className, isReview, userEmail, rate = 5, comment, date }: CommentCardProps) => {
  return (
    <Card className={`w-[437px] ${className}`}>
      <CardHeader className="flex items-center gap-4 px-5">
        <div className="relative lg:w-[58px] lg:h-[58px] size-12 rounded-full overflow-hidden">
          <Image
            src="/images/profile-img.png"
            alt="Comment"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="lg:text-lg text-base font-semibold">{userEmail ? userEmail.split("@")[0] : "Pengguna"}</h1>
          <p className="lg:text-sm text-xs text-gray-500">{date || "Baru saja"}</p>
        </div>
      </CardHeader>

      <CardContent className="px-5">
        <div className="flex justify-between items-center pb-[14px]">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className={`${index < rate ? "text-yellow-500" : "text-gray-300"} lg:size-5 size-4`} />
            ))}
          </div>
          <div>
            <Badge
              className={`text-secondary border-[#FFD6A7] bg-[#FFF7ED] px-3 py-2 font-bold ${
                isReview && "hidden"
              }`}
            >
              UMKM
            </Badge>
          </div>
        </div>
        <p className="font-medium text-[#606060] lg:text-base text-sm">
          {comment || "Tidak ada komentar."}
        </p>
        <div className="w-full h-[1px] bg-[#E1E1E1] my-[14px] flex items-center justify-center" />
        <CardFooter className="px-0 flex gap-3 ">
          <Like />
          <p className="text-[#606060] font-semibold text-sm lg:text-base">
            45
          </p>
          <p className="font-medium text-[#8D8D8D] lg:text-base text-sm">
            Orang merasa terbantu
          </p>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
