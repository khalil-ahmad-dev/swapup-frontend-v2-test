import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import CustomOutlineButton from "./CustomOutlineButton";
import { Button } from "@/components/ui/button";

interface IProp {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: () => void | Promise<void>;
  open: boolean;
  title: string;
  description: string;
  isLoading: boolean;
}

const RejectConfirmationDialog = ({ open, setOpen, handleConfirm, title, description, isLoading }: IProp) => {
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="w-[400px] p-0" >
        {/* header */}
        <div className="flex justify-between items-start px-6 py-3 rounded-tl-lg rounded-tr-lg bg-su_ternary_bg border-b-2 border-b-su_quaternary_bg">
          <h2 className="font-semibold text-xl" >{title} </h2>

          <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
            <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </DialogClose>
        </div>

        {/* body */}
        <div className="px-4 space-y-4">
          <p className="text-base font-medium text-secondary dark:text-su_secondary">{description}</p>
          <div className="w-full py-2 flex items-center justify-between" >
            <CustomOutlineButton
              className='py-2 px-5'
              onClick={() => setOpen(false)}
            >
              Cancel
            </CustomOutlineButton>

            <Button
              onClick={handleConfirm}
              isLoading={isLoading}
              variant={'reject'}
              iconLocation="right"
              iconButton
              className="normal-case py-2"
            >
              Reject offer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
};

export default RejectConfirmationDialog;