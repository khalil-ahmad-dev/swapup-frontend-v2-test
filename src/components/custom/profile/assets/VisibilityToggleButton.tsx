import { SUT_VisibilityToggleType } from '@/types/profile-store.types';

interface IProp {
  visibility: SUT_VisibilityToggleType;
  toggleVisibility: (value: SUT_VisibilityToggleType) => void;
}

const VisibilityToggleButton = ({ toggleVisibility, visibility }: IProp) => {
  return (
    <div className=' flex items-center gap-3' >
      <p className='text-xs text-su_ternary' >Show:</p>
      <span className="p-1 rounded-md dark:bg-su_enable_bg flex items-center lg:gap-1" >
        <button
          className={`w-[90px] lg:w-auto text-sm font-semibold capitalize p-2.5 rounded-sm ${visibility === "all" ? "bg-su_active_bg" : ""}`}
          onClick={() => toggleVisibility("all")}
        >
          all
        </button>

        <button
          className={`w-[90px] lg:w-auto text-sm font-semibold capitalize p-2.5 rounded-sm ${visibility === "hidden" ? "bg-su_active_bg" : ""}`}
          onClick={() => toggleVisibility("hidden")}
        >
          hidden
        </button>
      </span>
    </div>
  );
};

export default VisibilityToggleButton;