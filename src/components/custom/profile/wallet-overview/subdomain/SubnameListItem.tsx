import CustomIconButton from "@/components/custom/shared/CustomIconButton";
import CustomOutlineButton from "@/components/custom/shared/CustomOutlineButton";
import DeleteConfirmationDialog from "@/components/custom/shared/DeleteConfirmationDialog";
import ProfileTagTile from "@/components/custom/tiles/ProfileTagTile";
import SwapParameterTile from "@/components/custom/tiles/SwapParameterTile";
import { handleShowNotificationToast, showUnderConstructionToast, showWalletConnectionToast } from "@/lib/helpers";
import { SUI_SubnameItem } from "@/types/profile.types";
import { useState } from "react";

interface IProp {
  subname: SUI_SubnameItem;
  handleSubnameMintSectionReload: () => void;
}

const SubnameListItem = ({ subname, handleSubnameMintSectionReload }: IProp) => {
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] = useState(false);
  const [isDeletingSubname, setIsDeletingSubname] = useState(false);

  const handleConfirmDeletionSubname = async () => {
    try {
      setIsDeletingSubname(true);

      // Needs to be implemented

      showUnderConstructionToast();

      setOpenDeleteConfirmationDialog(false);
      handleSubnameMintSectionReload();
    } catch (error: any) {

      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.message}`
      );
    } finally {
      setIsDeletingSubname(false);
    }
  };

  return (
    <div className='bg-su_secondary_bg p-6 rounded-md flex flex-col gap-2 text-xs lg:text-sm'>
      <h3 className="font-semibold text-su_primary" >{subname.fullName}</h3>

      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:items-center">
        <div className="flex items-center flex-wrap gap-2" >
          <SwapParameterTile
            title="Manager:"
            value={subname.manager}
          />

          <SwapParameterTile
            title="Expiry:"
            value={subname.expiry}
          />

          <SwapParameterTile
            title="Parent:"
            value={subname.parent}
          />

          {subname.isPrimary && < ProfileTagTile variant="collector" showIcon={false} title="Primary" />}
        </div>

        <span className="w-full lg:w-auto flex justify-between items-center lg:gap-3" >
          {!subname.isPrimary &&
            <CustomOutlineButton className="px-5 py-2" >
              Set as primary
            </CustomOutlineButton>
          }

          <CustomIconButton
            className="w-8 h-8 flex items-center justify-center group text-su_disabled"
            onClick={() => { setOpenDeleteConfirmationDialog(true); }}
          >
            <svg className="w-3 group-hover:text-su_negative" viewBox="0 0 12 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0.888889H9L8.14286 0H3.85714L3 0.888889H0V2.66667H12M0.857143 14.2222C0.857143 14.6937 1.03775 15.1459 1.35925 15.4793C1.68074 15.8127 2.11677 16 2.57143 16H9.42857C9.88323 16 10.3193 15.8127 10.6408 15.4793C10.9622 15.1459 11.1429 14.6937 11.1429 14.2222V3.55556H0.857143V14.2222Z" fill="currentColor" />
            </svg>
          </CustomIconButton>
        </span>
      </div>

      <DeleteConfirmationDialog
        open={openDeleteConfirmationDialog}
        setOpen={setOpenDeleteConfirmationDialog}
        title={`Are you sure you want to delete ${subname.fullName} subdomain?`}
        description={"This action cannot be undone. Please proceed with caution."}
        handleConfirm={handleConfirmDeletionSubname}
        isLoading={isDeletingSubname}
      />
    </div>
  );
};

export default SubnameListItem;