import { cn } from "@/lib/utils";

interface IProp extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  filterApplied?: boolean;
  className?: string;
  iconClasses?: string;
  showTitleOnMobile?: boolean;
}

const FilterButton = ({ filterApplied = false, className, iconClasses, showTitleOnMobile = false, ...props }: IProp) => {
  return (
    <span
      className={cn(
        `flex items-center gap-2 px-4 py-2 rounded-xs font-semibold text-lg ${filterApplied ? "bg-su_active_bg px-3" : 'hover:bg-su_active_bg'}`,
        className
      )}
      {...props}
    >
      {
        filterApplied ?
          <svg
            className={cn(
              `w-6`,
              iconClasses
            )}
            viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="5" r="2" fill="#FF7585" />
            <path d="M10.416 3H3.4375C3.32147 3 3.21019 3.05086 3.12814 3.1414C3.04609 3.23193 3 3.35472 3 3.48276V4.28897C3.00008 4.40299 3.02061 4.51586 3.06041 4.62109C3.1002 4.72631 3.15848 4.82181 3.23187 4.90207L8.24998 10.5214V15.4455L11.75 17V10.4828L12.6944 9.43787C11.0934 8.60438 10 6.92987 10 5C10 4.2889 10.1484 3.61246 10.416 3Z" fill="currentColor" />
          </svg>
          :
          <svg
            className={cn(
              `w-3 `,
              iconClasses
            )}
            viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.74997 14V7.48277L13.7681 1.93105C13.8427 1.84875 13.9016 1.75084 13.9414 1.64307C13.9812 1.5353 14.0011 1.41984 14 1.30346V0.482774C14 0.354738 13.9539 0.231947 13.8718 0.141412C13.7898 0.0508773 13.6785 1.52588e-05 13.5625 1.52588e-05H0.437498C0.321467 1.52588e-05 0.210187 0.0508773 0.12814 0.141412C0.0460934 0.231947 0 0.354738 0 0.482774V1.28898C8.18042e-05 1.403 0.0206123 1.51588 0.0604084 1.6211C0.100204 1.72633 0.158479 1.82182 0.231874 1.90208L5.24998 7.52139V12.4455L8.74997 14Z" fill="currentColor" />
          </svg>
      }

      <span className={`${showTitleOnMobile ? "inline-block" : 'hidden'} lg:inline-block capitalize`}>filter</span>
    </span>
  );
};

export default FilterButton;