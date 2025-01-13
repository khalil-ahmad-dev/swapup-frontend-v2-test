import { cn } from "@/lib/utils";
interface IProp {
  className?: string;
  label: string;
  children: any;
  valueClasses?: string;
}

const AppliedFilterItemTile = ({ className, label, children, valueClasses, ...props }: IProp) => {
  return (
    <p
      className={cn(
        "text-xs text-text dark:text-su_secondary flex items-center gap-2 ",
        className
      )}
      {...props}
    >
      <span className="">{label}</span>

      <p
        className={cn(
          "flex items-center gap-1",
          valueClasses
        )}
      >
        {children}
      </p>
    </p>
  );
};

export default AppliedFilterItemTile


