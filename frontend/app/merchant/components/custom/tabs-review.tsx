import RatingStar from "@/components/icons/rating-star";
import CommentCard from "@/components/shared/comment-card";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

type ReviewContent = {
  percentage: number;
  number: number;
};

interface TabsReviewProps {
  ratings?: { id: string; rate: number; comment: string; user?: { email: string }; created_at: string }[];
}

const ReviewBar = ({ percentage, number }: ReviewContent) => {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 text-sm lg:text-base">
      {/* angka + icon */}
      <div className="flex items-center justify-end gap-3 w-[36px] ">
        <p className="font-medium text-gray-700">{number}</p>
        <RatingStar className="text-yellow-500 size-4" />
      </div>

      {/* progress bar */}
      <Progress
        value={percentage}
        className="h-2 bg-[#E1E1E1] [&>div]:bg-primary rounded-full"
      />

      {/* persentase */}
      <p className="w-[40px] text-right text-gray-700 font-medium">
        {percentage}%
      </p>
    </div>
  );
};
const TabsReview = ({ ratings = [] }: TabsReviewProps) => {
  const totalReviews = ratings.length;
  const averageRating = totalReviews > 0 
    ? (ratings.reduce((acc, curr) => acc + curr.rate, 0) / totalReviews).toFixed(1)
    : "0.0";

  const getPercentage = (stars: number) => {
    if (totalReviews === 0) return 0;
    const count = ratings.filter(r => r.rate === stars).length;
    return Math.round((count / totalReviews) * 100);
  };

  const dynamicReviewContent: ReviewContent[] = [
    { percentage: getPercentage(5), number: 5 },
    { percentage: getPercentage(4), number: 4 },
    { percentage: getPercentage(3), number: 3 },
    { percentage: getPercentage(2), number: 2 },
    { percentage: getPercentage(1), number: 1 },
  ];

  return (
    <TabsContent value="reviews">
      <Card className="lg:px-7.5 px-5 ">
        <CardContent className="!px-0 lg:grid grid-cols-3">
          <div className="space-y-3 mb-4 lg:mb-0">
            <h1 className="text-primary text-3xl font-semibold">{averageRating}</h1>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className={`${index < Math.round(Number(averageRating)) ? "text-yellow-500" : "text-gray-300"}`}>
                  <RatingStar />
                </div>
              ))}
            </div>
            <p className="text-[#8D8D8D] text-sm lg:text-base font-medium">
              Berdasarkan {totalReviews} ulasan
            </p>
          </div>
          <div className="col-span-2 ">
            {dynamicReviewContent.map((item, index) => (
              <ReviewBar key={index} {...item} />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-none ">
        <CardContent className="!p-0 space-y-4">
          {ratings.length > 0 ? (
            ratings.map((rating) => (
              <CommentCard 
                key={rating.id} 
                className="!w-full" 
                isReview={true} 
                userEmail={rating.user?.email}
                rate={rating.rate}
                comment={rating.comment}
                date={formatDistanceToNow(new Date(rating.created_at), { addSuffix: true, locale: id })}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-6">Belum ada ulasan untuk UMKM ini.</p>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default TabsReview;
