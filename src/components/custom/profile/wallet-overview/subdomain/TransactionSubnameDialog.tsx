import CustomAvatar from '@/components/custom/shared/CustomAvatar';
import CustomLoadingBar from '@/components/custom/shared/CustomLoadingBar';
import CustomOutlineButton from '@/components/custom/shared/CustomOutlineButton';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { handleShowNotificationToast } from '@/lib/helpers';
import { useProfileStore } from '@/store/profile';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface IProp {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  handleNavigationOfSteps: (navigationMode: "NEXT" | "PREVIOUS") => void;
  setStartCreateSubdomainProcess: React.Dispatch<React.SetStateAction<boolean>>;
}

const TransactionSubnameDialog = ({ handleNavigationOfSteps, open, setOpen, setStartCreateSubdomainProcess }: IProp) => {
  const [isDone, setIsDone] = useState(false);

  const [name, action, subname, transactionHash, resetSwapCreation, avatar, isPremium, title] = useProfileStore(state => [
    state.overviewTab.subdomainSection.createNewSubdomain.name,
    state.overviewTab.subdomainSection.createNewSubdomain.action,
    state.overviewTab.subdomainSection.createNewSubdomain.subname,
    state.overviewTab.subdomainSection.createNewSubdomain.transactionHash,
    state.overviewTab.subdomainSection.createNewSubdomain.resetSwapCreation,
    state.profile.avatar,
    state.profile.isPremium,
    state.profile.details?.title,
  ]);

  const handleSuccess = () => {
    handleShowNotificationToast(
      "success",
      `Subname created Successfully`,
      `Transaction: \n ${transactionHash}`,
      6000
    );

    setOpen(false);
    setStartCreateSubdomainProcess(false);
    resetSwapCreation();
  };

  useEffect(() => {
    if (isDone) {
      handleSuccess();
    }
  }, [isDone]);



  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="w-[400px] p-4" >
        <div className="space-y-3" >
          {/* header */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-xl pt-3" >Transaction Sent</h2>

              <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </DialogClose>
            </div>

            <p className="text-base font-medium text-secondary dark:text-su_secondary">Your transaction is almost complete,<br /> you can now close this modal.</p>
          </div>

          <div className='space-y-3' >
            <CustomLoadingBar setIsDone={setIsDone} isDone={isDone} />

            <div className='border-[1.5px] border-su_enable_bg rounded-sm py-3.5 px-4 flex items-center justify-between text-xs lg:text-sm' >
              <p className='text-su_ternary' >Name</p>

              <span className='flex items-center gap-2 text-su_primary font-semibold' >
                {name}

                <img
                  className='h-7 w-7 object-cover'
                  src={"/assets/logos/swapup-icon-gradient.svg"}
                  alt=""
                />
              </span>
            </div>

            <div className='border-[1.5px] border-su_enable_bg rounded-sm py-3.5 px-4 flex items-center justify-between text-xs lg:text-sm' >
              <p className='text-su_ternary' >Action</p>

              <span className='flex items-center gap-2 text-su_primary font-semibold' >
                {action}
              </span>
            </div>

            <div className='border-[1.5px] border-su_enable_bg rounded-sm py-3.5 px-4 flex items-center justify-between text-xs lg:text-sm' >
              <p className='text-su_ternary' >Subname</p>

              <span className='flex items-center gap-2 text-su_primary font-semibold' >
                {subname}.{name}

                <CustomAvatar
                  imageSrc={avatar}
                  fallbackName={title || ''}
                  isPremium={isPremium}
                  sizeClasses="!w-7 !h-7"
                />
              </span>
            </div>
          </div>

          <div className="w-full py-2" >
            <CustomOutlineButton
              containerClasses="w-full h-full"
              className='py-3'
              onClick={() => { handleNavigationOfSteps('NEXT'); }}
            >
              {isDone ? "Done" : "Close"}
            </CustomOutlineButton>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
};

export default TransactionSubnameDialog;