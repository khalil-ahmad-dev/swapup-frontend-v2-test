import { cn } from "@/lib/utils";
interface IProp {
  className?: string;
  children?: any;

}

const BadgeTile = ({ className, children, ...props }: IProp) => {
  return (
    <span
      className={cn(
        "flex justify-center items-center gap-2 py-2 px-2.5 rounded-full bg-su_enable_bg capitalize font-medium text-xs",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default BadgeTile


