import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import CustomOutlineButton from "./CustomOutlineButton";

interface IProp {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: () => void | Promise<void>;
  open: boolean;
  title: string;
  description: string;
  isLoading: boolean;
}

const DeleteConfirmationDialog = ({ open, setOpen, handleConfirm, title, description, isLoading }: IProp) => {
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="w-[400px] p-4" >
        <div className="space-y-3" >
          {/* header */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-xl pt-3" >{title} </h2>

              <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </DialogClose>
            </div>

            <p className="text-base font-medium text-secondary dark:text-su_secondary">{description}</p>
          </div>

          <div className="w-full py-2" >
            <CustomOutlineButton
              containerClasses="w-full h-full"
              className='py-3'
              onClick={handleConfirm}
              isLoading={isLoading}
            >
              Confirm
            </CustomOutlineButton>
          </div>

        </div>
      </DialogContent>
    </Dialog >
  );
};

export default DeleteConfirmationDialog;