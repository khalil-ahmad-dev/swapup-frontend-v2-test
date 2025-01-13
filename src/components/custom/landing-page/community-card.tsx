import React from "react";

interface CommunityCardProps {
  number?: string;
  title: string;
  description: String;
  comingSoon?: boolean;
  icon?: string;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  number,
  title,
  description,
  comingSoon,
  icon,
}) => {
  return (
    <div
      className="w-full p-2 md:p-6 rounded-md mb-4 md:mb-0 bg-[#212036] relative"
    >
      {comingSoon && (
        <div
          className="absolute right-4 top-4 flex items-center justify-center text-end font-Urbanist font-semibold text-xs bg-white text-[#0D0D23] rounded-md w-24 h-8"
        >
          Coming soon
        </div>
      )}
      <div className="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 md:space-y-4">
        {icon ? (
          <img src={icon} className="ml-2 md:ml-0 w-5 h-5 md:w-auto md:h-auto mb-0 md:mb-2" alt="icon" />
        ) : (
          <p className="text-su_primary_lighter font-Urbanist text-base leading-10 mt-2">
            {number}
          </p>
        )}
        <p className="text-su_primary font-poppins leading-10 text-xl font-semibold md:mt-6">
          {title}
        </p>
      </div>
      <p className="text-su_primary_lighter font-Urbanist text-sm pb-2 md:pb-0  md:mt-2">
        {description}
      </p>
    </div>
  );
};

export default CommunityCard;
