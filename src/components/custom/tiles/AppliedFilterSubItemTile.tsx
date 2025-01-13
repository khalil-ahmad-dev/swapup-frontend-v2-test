import { cn } from "@/lib/utils";
interface IProp {
  className?: string;
  children: any;
  hideActionButton?: boolean;
  handleAction: () => void;
}

const AppliedFilterSubItemTile = ({ className, children, hideActionButton, handleAction, ...props }: IProp) => {
  return (
    <span
      className={cn(
        "text-su_primary flex items-center gap-2.5 cursor-pointer bg-su_enable_bg rounded-xs px-3 py-2 text-xs lg:text-sm font-semibold",
        className
      )}
      {...props}
    >
      <span className={""}>{children}</span>

      {!hideActionButton &&

        <span
          className='p-1 rounded-full text-su_ternary hover:bg-su_active_bg'
          onClick={handleAction}
        >
          <svg className='w-2' viewBox="0 0 8 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M7.47177 1.58902L8.00207 1.05866L6.94137 -0.00195312L6.41106 0.528399L4.00006 2.9396L1.58906 0.528399L1.05875 -0.00195312L-0.00195312 1.05866L0.528355 1.58902L2.93944 4.0003L0.528356 6.41159L-0.00195312 6.94194L1.05875 8.00256L1.58906 7.47221L4.00006 5.06101L6.41106 7.47221L6.94137 8.00256L8.00207 6.94194L7.47176 6.41159L5.06068 4.0003L7.47177 1.58902Z" fill="currentColor" />
          </svg>
        </span>
      }
    </span>
  );
};

export default AppliedFilterSubItemTile


