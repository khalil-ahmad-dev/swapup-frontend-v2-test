import { cn } from "@/lib/utils";
interface IProp {
  className?: string;
  title: string;
  value?: string | any;
  valueClasses?: string;
}

const SwapParameterTile = ({ className, title, value, valueClasses, ...props }: IProp) => {
  return (
    <span
      className={cn(
        "bg-background text-text dark:bg-su_enable_bg dark:text-su_ternary text-xs flex items-center font-semibold gap-2 p-2 rounded-xs",
        className
      )}
      {...props}
    >
      <span className="">{title}</span>
      <span
        className={
          cn(
            "text-text dark:text-su_primary",
            valueClasses
          )
        }
      >{value}</span>
    </span>
  );
};

export default SwapParameterTile


