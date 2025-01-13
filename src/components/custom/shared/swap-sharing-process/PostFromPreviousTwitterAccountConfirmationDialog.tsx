import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import CustomOutlineButton from "../CustomOutlineButton";
import { Button } from "@/components/ui/button";
import { SUT_SwapSharingActionType } from "./SwapSharingOnSocialProcess";
import { SUI_TwitterUserInformation } from "@/types/third-party.types";
import { handleTwitterSharingProcessLocalstorageState } from "@/lib/utils";


interface IProp {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: () => void;
  open: boolean;
  title: string;
  description: string;
  handleShareSwapPostOnSocialPlatform: (platformActionType: SUT_SwapSharingActionType, base64Image?: string) => Promise<void>;
  previousTwitterUserInfo: SUI_TwitterUserInformation | null;
}

const PostFromPreviousTwitterAccountConfirmationDialog = ({ open, setOpen, handleConfirm, title, description, handleShareSwapPostOnSocialPlatform, previousTwitterUserInfo }: IProp) => {

  const handleOnOpenChange = (state: boolean) => {
    setOpen(state);

    if (!state) {
      handleTwitterSharingProcessLocalstorageState('REMOVE');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange} >
      <DialogContent className="w-[400px] p-4" >
        <div className="space-y-4" >
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

            <p className="text-base font-medium text-secondary dark:text-su_secondary">
              Your previous saved twitter username is <span className="font-semibold" >{previousTwitterUserInfo?.username}</span>
              <br />
              Do you want to create post from this account?
            </p>
          </div>


          <div className="w-full grid grid-cols-2 gap-4 py-2" >
            <CustomOutlineButton onClick={() => { handleShareSwapPostOnSocialPlatform('NO_GET_NEW_AUTH_CODE'); }} >
              No
            </CustomOutlineButton>

            <Button variant={"default"} type="submit" onClick={() => { handleShareSwapPostOnSocialPlatform('YES_POST_FROM_PREVIOUS_ACCOUNT'); }} >
              Yes
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog >
  );
};

export default PostFromPreviousTwitterAccountConfirmationDialog;