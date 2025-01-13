import { cn, getNameInitials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface IProp extends React.HTMLAttributes<HTMLSpanElement> {
  imageSrc: string;
  fallbackName: string;
  isPremium?: boolean;
  className?: string;
  sizeClasses?: string;
  textSizeClasses?: string;
  isPremiumClasses?: string;
}

const CustomAvatar = ({
  imageSrc,
  fallbackName,
  className,
  isPremium = false,
  sizeClasses = "w-6 h-6 lg:w-10 lg:h-10",
  textSizeClasses = "text-xs lg:text-sm",
  isPremiumClasses,
  ...props
}: IProp) => {
  return (
    <Avatar
      className={cn(
        `relative`,
        className,
        sizeClasses,
        textSizeClasses
      )}

      {...props}
    >
      <AvatarImage className="rounded-full object-cover" src={imageSrc} alt="@shadcn" />
      <AvatarFallback className={`uppercase text-3xs lg:text-sm font-semibold rounded-full dark:bg-su_enable_bg w-full h-full ${textSizeClasses} flex justify-center items-center`}>
        {getNameInitials(fallbackName)}
      </AvatarFallback>

      {
        isPremium &&
        <div className={cn(
          "absolute h-2 w-2 lg:h-4 lg:w-4 bg-black rounded-full -right-0.5 -bottom-0.5 flex justify-center items-center !z-10",
          isPremiumClasses
        )}
        >
          <svg className="w-[60%] h-[60%]" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.666016 5.2H6.66602V6H0.666016L0.666016 5.2ZM0.666016 0.947368L2.16602 1.89474L3.66602 0L5.16602 1.89474L6.66602 0.947368V4.8H0.666016V0.947368Z" fill="#FFC175" />
          </svg>
        </div>
      }
    </Avatar>
  );
};

export default CustomAvatar;