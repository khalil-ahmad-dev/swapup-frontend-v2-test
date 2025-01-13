import { SUT_GridViewType } from "@/types/swap-market-store.types";

interface IProp {
  activeGridView?: SUT_GridViewType;
  toggleView: (value: SUT_GridViewType) => void;
}

const GridToggleButton = ({ activeGridView = "detailed", toggleView }: IProp) => {
  return (
    <div className="p-1 rounded-md dark:bg-su_enable_bg flex items-center lg:gap-1" >

      <button
        className={`p-2.5 rounded-sm ${activeGridView === "detailed" ? "bg-su_active_bg" : ""}`}
        onClick={() => toggleView("detailed")}
      >
        <svg className="w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.5 0.5H7.16667V7.16668H0.5V0.5ZM0.5 8.83335H7.16667V15.5H0.5V8.83335ZM8.83334 0.5H15.5V7.16668H8.83334V0.5ZM8.83334 8.83335H15.5V15.5H8.83334V8.83335Z" fill="white" />
        </svg>
      </button>

      <button
        className={`p-2.5 rounded-sm ${activeGridView === "overview" ? "bg-su_active_bg" : ""}`}
        onClick={() => toggleView("overview")}
      >
        <svg className="w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.5 15.5H4.39584V11.6042H0.5V15.5ZM6.0625 15.5H9.93751V11.6042H6.0625V15.5ZM11.6042 15.5H15.5V11.6042H11.6042V15.5ZM0.5 9.93752H4.39584V6.06251H0.5V9.93752ZM6.0625 9.93752H9.93751V6.06251H6.0625V9.93752ZM11.6042 9.93752H15.5V6.06251H11.6042V9.93752ZM0.5 4.39584H4.39584V0.5H0.5V4.39584ZM6.0625 4.39584H9.93751V0.5H6.0625V4.39584ZM11.6042 4.39584H15.5V0.5H11.6042V4.39584Z" fill="white" />
        </svg>
      </button>

    </div>
  );
};

export default GridToggleButton;