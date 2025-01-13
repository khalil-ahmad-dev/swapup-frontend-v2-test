import { cn } from "@/lib/utils";

interface IProp {
  className?: string;
  children?: any;
}

const CustomTabContainer = ({ className, children, ...props }: IProp) => {
  return (
    <div
      className={cn(
        "flex h-12 items-center justify-start gap-2 border-b-2 border-su_enable_bg w-full bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default CustomTabContainer;