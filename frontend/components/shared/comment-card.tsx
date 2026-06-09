import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Star from "../icons/star";
import { Badge } from "../ui/badge";
import Like from "../icons/like-icon";

interface CommentCardProps {
  className?: string;
  isReview?: boolean;
  userEmail?: string;
  rate?: number;
  comment?: string;
  date?: string;
  merchantType?: string;
}

const formatRelativeDate = (dateStr?: string) => {
  if (!dateStr) return "Baru saja";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Baru saja";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 30) return `${days} hari lalu`;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const CommentCard = ({
  className,
  isReview,
  userEmail,
  rate = 5,
  comment,
  date,
  merchantType,
}: CommentCardProps) => {
  const username = userEmail ? userEmail.split("@")[0] : "Pengguna";
  const initial = username.charAt(0).toUpperCase();

  const colors = [
    "bg-orange-400", "bg-blue-400", "bg-green-400",
    "bg-purple-400", "bg-pink-400", "bg-indigo-400",
    "bg-teal-400", "bg-red-400",
  ];
  const colorIdx =
    username.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  const avatarColor = colors[colorIdx];

  return (
    <Card className={`w-[437px] ${className}`}>
      <CardHeader className="flex items-center gap-4 px-5">
        <div
          className={`lg:w-[58px] lg:h-[58px] size-12 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-lg ${avatarColor}`}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <h1 className="lg:text-lg text-base font-semibold truncate max-w-[160px]">
            {username}
          </h1>
          <p className="lg:text-sm text-xs text-gray-500">
            {formatRelativeDate(date)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-5">
        <div className="flex justify-between items-center pb-[14px]">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`${
                  index < rate ? "text-yellow-500" : "text-gray-300"
                } lg:size-5 size-4`}
              />
            ))}
          </div>
          <div>
            <Badge
              className={`text-secondary border-[#FFD6A7] bg-[#FFF7ED] px-3 py-2 font-bold ${
                isReview ? "hidden" : ""
              }`}
            >
              {merchantType || "UMKM"}
            </Badge>
          </div>
        </div>
        <p className="font-medium text-[#606060] lg:text-base text-sm line-clamp-3">
          {comment && comment.trim() ? comment : "Produk bagus, pelayanan ramah!"}
        </p>
        <div className="w-full h-[1px] bg-[#E1E1E1] my-[14px]" />
        <CardFooter className="px-0 flex gap-3">
          <Like />
          <p className="text-[#606060] font-semibold text-sm lg:text-base">
            {rate * 9}
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
