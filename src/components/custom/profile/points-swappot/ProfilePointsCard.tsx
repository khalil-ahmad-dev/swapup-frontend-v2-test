import { Card, CardContent } from "@/components/ui/card";
import { SUT_AvailablePointSystemPointsType } from "@/types/profile.types";

interface IProp {
  image: string;
  title: string;
  description: string;
  points: number;
}

const ProfilePointsCard = ({ image, title, description, points }: IProp) => {

  return (
    <Card className="h-[90px] px-3 flex items-center justify-center bg-card dark:bg-su_secondary_bg" >

      <div className="flex items-center gap-4 w-full" >
        <img className="w-12 h-12 rounded-full object-cover" src={image} alt="" />

        <div className="w-full" >
          <h2 className="text-text dark:text-su_primary font-semibold text-sm mb-.5" >{title}</h2>

          <div className="text-secondary dark:text-su_ternary text-xs flex items-center justify-between w-full" >
            <p className="w-[70%] line-clamp-2" >{description}</p>
            <p className="flex items-center gap-2" >
              <span className="text-text text-su_primary text-base font-semibold" >{points}</span>
              <span>Points</span>
            </p>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default ProfilePointsCard;