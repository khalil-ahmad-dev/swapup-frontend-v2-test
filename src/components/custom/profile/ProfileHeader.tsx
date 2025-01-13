import CopyTile from "../tiles/CopyTile";
import ExitPageDialog from "../shared/ExitPageDialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { generateRandomKey, getShortenWalletAddress } from "@/lib/utils";
import CustomAvatar from "../shared/CustomAvatar";
import SwapParameterTile from "../tiles/SwapParameterTile";
import { defaults } from "@/constants/defaults";
import CustomIconButton from "../shared/CustomIconButton";
import EditProfileImageDialog from "./EditProfileImageDialog";
import CustomOutlineButton from "../shared/CustomOutlineButton";
import EditProfileInfoDialog from "./EditProfileInfoDialog";
import { SUI_DeleteProfilePicturePayload } from "@/types/profile.types";
import { Link, useLocation } from "react-router-dom";
import ProfileTagTile from "../tiles/ProfileTagTile";
import { useProfileStore } from "@/store/profile";
import moment from "moment";
import EditProfileCoverImageDialog from "./EditProfileCoverImageDialog";
import { Schema_ProfileEditCoverImageForm } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { deleteProfilePictureApi } from "@/service/api/user.service";
import { handleShowNotificationToast } from "@/lib/helpers";


interface IProp {
  backClickNavigateTo?: string;
  resetData: () => void;
  existTitle: string;
  existDescription: string;
}

const ProfileHeader = ({ backClickNavigateTo, resetData, existDescription, existTitle }: IProp) => {
  const { pathname } = useLocation();

  const [profile, setProfileCoverImage] = useProfileStore(state => [state.profile, state.setProfileCoverImage]);

  const [currentEditCover, setCurrentEditCover] = useState(profile.coverImage);
  const [editCoverFormKey, setEditCoverFormKey] = useState(generateRandomKey(6));

  const [openEditProfilePictureDialog, setOpenEditProfilePictureDialog] = useState(false);
  const [openEditProfileCoverDialog, setOpenEditProfileCoverDialog] = useState(false);

  const [openEditProfileDetailsDialog, setOpenProfileDetailsDialog] = useState(false);

  const [isRemovingCover, setIsRemovingCover] = useState(false);


  const form = useForm<z.infer<typeof Schema_ProfileEditCoverImageForm>>({
    resolver: zodResolver(Schema_ProfileEditCoverImageForm),
    defaultValues: {
      coverImage: undefined,
    },
  });

  const handleRemoveProfileCoverImage = async () => {
    try {
      setIsRemovingCover(true);

      const payload: SUI_DeleteProfilePicturePayload = {
        pictureType: 'profile-cover',
        walletId: profile.wallet.address
      };

      const deleteResult = await deleteProfilePictureApi(payload);
      console.log("Deleted image res: ", deleteResult);

      if (deleteResult.data) {

        handleShowNotificationToast(
          'success',
          "Image deleted successfully!",
          'Your profile picture is deleted.'
        );

        setProfileCoverImage('');
        setCurrentEditCover('');
        setEditCoverFormKey(generateRandomKey(6));

        setOpenEditProfileCoverDialog(false);
      }

    } catch (error: any) {
      handleShowNotificationToast(
        'error',
        "Error while deleting picture",
        error.message
      );
    } finally {
      setIsRemovingCover(false);
    }
  };

  return (
    <div className="w-full space-y-3" >

      <div className="flex items-center gap-6 lg:gap-3" >
        <ExitPageDialog
          title={existTitle}
          description={existDescription}
          redirectPath={backClickNavigateTo ? backClickNavigateTo : defaults.fallback.route}
          resetData={resetData}

        >
          <span
            className="text-sm dark:text-su_secondary flex items-center gap-2 cursor-pointer py-2 px-3 hover:rounded-sm hover:bg-su_secondary_bg">
            <svg className="w-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 0L7.0575 1.0575L2.8725 5.25H12V6.75H2.8725L7.0575 10.9425L6 12L0 6L6 0Z" fill="#B6B6BD" />
            </svg>

            Back
          </span>
        </ExitPageDialog>

        <div className="w-full flex items-center justify-between">
          <h2 className="font-semibold text-1.5xl " >Profile</h2>


        </div>
      </div>

      <div className="w-full space-y-4">
        {/* 👇️ local image */}
        <div className="w-full relative" >
          <div className="relative group" >
            <img src={profile.coverImage ? profile.coverImage : defaults.fallback.profileCover} alt="profile cover" className="w-full h-40 object-cover rounded-sm" loading="lazy" />

            <div className="hidden group-hover:flex hover:flex absolute right-2 bottom-2  justify-center items-center gap-3" >
              <CustomOutlineButton
                className="px-[20px] py-2 "
                onClick={handleRemoveProfileCoverImage}
                type="button"
                isLoading={isRemovingCover}
              >
                Remove
              </CustomOutlineButton>

              <CustomOutlineButton
                className="px-[20px] py-2"
                onClick={() => setOpenEditProfileCoverDialog(true)}
                type="button"
              >
                Replace
              </CustomOutlineButton>
            </div>
          </div>

          <div
            className="absolute -bottom-8 lg:-bottom-12 p-1 rounded-full bg-su_primary_bg"
            onClick={() => { setOpenEditProfilePictureDialog(true); }}
          >
            <CustomAvatar
              className=""
              imageSrc={profile.avatar}
              fallbackName={profile.details?.title || ''}
              sizeClasses="w-16 h-16 lg:w-20 lg:h-20"
              textSizeClasses="text-1.5xl lg:text-2.5xl"
            />
          </div>
        </div>

        <div className="flex justify-between items-center ml-20 lg:ml-24" >

          <div className="flex items-center gap-2 lg:gap-3">
            <h2 className="font-semibold text-xl lg:text-1.5xl" >{profile.ensAddress}</h2>

            <CopyTile textToCopy={profile.wallet.address} className="hidden lg:flex" >
              <span className="dark:text-su_primary font-semibold">{getShortenWalletAddress(profile.wallet.address)}</span>
            </CopyTile>

            <p className="text-sm hidden lg:inline-block text-su_ternary" >Joined {moment.utc(profile.joinDate).format("MMM, YYYY")}</p>
          </div>

          {/* Action / Social icons */}
          <span className="flex items-center gap-2">

            <CustomIconButton
              title="edit-profile-image"
              onClick={() => setOpenProfileDetailsDialog(true)}
            >
              <svg className="w-3" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 9.64016V11.6668C0 11.8535 0.146667 12.0002 0.333333 12.0002H2.36C2.44667 12.0002 2.53333 11.9668 2.59333 11.9002L9.87333 4.62683L7.37333 2.12683L0.1 9.40017C0.0333334 9.46683 0 9.54683 0 9.64016ZM11.8067 1.7535L10.2467 0.193498C10.185 0.131695 10.1117 0.0826637 10.0311 0.0492094C9.95043 0.0157551 9.86398 -0.00146484 9.77667 -0.00146484C9.68935 -0.00146484 9.6029 0.0157551 9.52225 0.0492094C9.4416 0.0826637 9.36834 0.131695 9.30667 0.193498L8.08667 1.4135L10.5867 3.9135L11.8067 2.6935C11.8685 2.63182 11.9175 2.55856 11.951 2.47791C11.9844 2.39727 12.0016 2.31081 12.0016 2.2235C12.0016 2.13619 11.9844 2.04973 11.951 1.96908C11.9175 1.88843 11.8685 1.81517 11.8067 1.7535Z" fill="currentColor" />
              </svg>
            </CustomIconButton>

            <CustomIconButton title="share">
              <svg className="w-3" viewBox="0 0 13 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.2498 11.4999C12.2498 11.8284 12.178 12.1528 12.0393 12.4505C11.9006 12.7481 11.6984 13.0119 11.447 13.2231C11.1955 13.4343 10.9009 13.5879 10.5837 13.6732C10.2666 13.7584 9.9346 13.7731 9.61114 13.7164C9.28767 13.6597 8.98054 13.5328 8.71132 13.3448C8.4421 13.1567 8.21731 12.912 8.05273 12.6278C7.88815 12.3436 7.78778 12.0269 7.75866 11.6997C7.72954 11.3726 7.77239 11.0431 7.88418 10.7343L4.57168 8.6062C4.25531 8.91653 3.85434 9.12652 3.41908 9.20983C2.98382 9.29314 2.53365 9.24607 2.12505 9.0745C1.71644 8.90294 1.3676 8.61454 1.12228 8.24547C0.876962 7.8764 0.746094 7.44311 0.746094 6.99995C0.746094 6.55679 0.876962 6.12349 1.12228 5.75443C1.3676 5.38536 1.71644 5.09696 2.12505 4.92539C2.53365 4.75383 2.98382 4.70675 3.41908 4.79007C3.85434 4.87338 4.25531 5.08337 4.57168 5.3937L7.88418 3.2687C7.69449 2.74748 7.70351 2.17464 7.9095 1.65964C8.11548 1.14465 8.504 0.723607 9.00081 0.476968C9.49762 0.23033 10.0679 0.17539 10.6026 0.322647C11.1374 0.469904 11.5992 0.809032 11.8997 1.27523C12.2002 1.74143 12.3184 2.30201 12.2317 2.84986C12.145 3.3977 11.8595 3.8944 11.4298 4.24505C11 4.59569 10.4561 4.77569 9.90199 4.75065C9.34789 4.72562 8.82245 4.4973 8.42605 4.10932L5.11355 6.23745C5.29258 6.73217 5.29258 7.27398 5.11355 7.7687L8.42605 9.89682C8.74232 9.5873 9.14283 9.37791 9.57749 9.29485C10.0122 9.21179 10.4617 9.25875 10.8698 9.42985C11.2779 9.60095 11.6265 9.8886 11.8719 10.2568C12.1174 10.625 12.2488 11.0574 12.2498 11.4999Z" fill="currentColor" />
              </svg>
            </CustomIconButton>
          </span>
        </div>

        <div className="lg:hidden flex justify-between items-center" >
          <CopyTile textToCopy={profile.wallet.address} >
            <span className="dark:text-su_primary font-semibold">{getShortenWalletAddress(profile.wallet.address)}</span>
          </CopyTile>

          <p className="text-sm" >Joined {moment.utc(profile.joinDate).format("MMM, YYYY")}</p>
        </div>

        {/*Profile Tags section */}
        <div className="flex items-center flex-wrap gap-2 ">
          {
            profile.details?.tags?.map(tag => (
              <ProfileTagTile key={tag} variant={tag} />
            ))
          }

          <SwapParameterTile
            title="Total Points Earned: "
            value={profile.details?.points?.total || 0}
          />
        </div>

        {/*Profile Description Section*/}
        <p className="dark:text-su_ternary flex items-center gap-2 !line-clamp-5 lg:!line-clamp-3">
          {profile.details?.description}
        </p>

        <div className="flex items-center gap-2">
          <Link to={profile.details?.twitter || pathname} target="_blank">
            <CustomIconButton title="twitter" >
              <svg className="w-3" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.2909 0L7.26897 5.08286L12 12H8.29577L5.39748 7.80429L2.07685 12H0.236358L4.53729 6.56143L0 0H3.79722L6.42041 3.83571L9.45044 0H11.2909ZM9.82628 10.7829L3.24314 1.15286H2.14659L8.80336 10.7829H9.82241H9.82628Z" fill="currentColor" />
              </svg>
            </CustomIconButton>
          </Link>

          <Link to={profile.details?.warpcast || pathname} target="_blank">
            <CustomIconButton title="warpcast" >
              <svg className="w-3" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.05917 0H9.79881V12H8.66272V6.50323H8.65158C8.52601 4.98405 7.35501 3.79354 5.92899 3.79354C4.50298 3.79354 3.33198 4.98405 3.2064 6.50323H3.19527V12H2.05917V0Z" fill="currentColor" />
                <path d="M0 1.70321L0.46154 3.40645H0.852066V10.2968C0.655988 10.2968 0.49704 10.4701 0.49704 10.6839V11.1484H0.426041C0.229963 11.1484 0.0709986 11.3217 0.0709986 11.5355V12H4.04733V11.5355C4.04733 11.3217 3.88838 11.1484 3.69231 11.1484H3.62131V10.6839C3.62131 10.4701 3.46234 10.2968 3.26627 10.2968H2.84024V1.70321H0Z" fill="currentColor" />
                <path d="M8.73373 10.2968C8.53766 10.2968 8.37869 10.4701 8.37869 10.6839V11.1484H8.30769C8.11162 11.1484 7.95267 11.3217 7.95267 11.5355V12H11.929V11.5355C11.929 11.3217 11.77 11.1484 11.574 11.1484H11.503V10.6839C11.503 10.4701 11.344 10.2968 11.1479 10.2968V3.40645H11.5385L12 1.70321H9.15976V10.2968H8.73373Z" fill="currentColor" />
              </svg>
            </CustomIconButton>
          </Link>

        </div>

      </div>

      <EditProfileImageDialog
        open={openEditProfilePictureDialog}
        setOpen={setOpenEditProfilePictureDialog}
      />

      <EditProfileCoverImageDialog
        handleRemoveProfileCoverImage={handleRemoveProfileCoverImage}
        form={form}
        editCoverFormKey={editCoverFormKey}
        currentEditCover={currentEditCover}
        setEditCoverFormKey={setEditCoverFormKey}
        setCurrentEditCover={setCurrentEditCover}
        open={openEditProfileCoverDialog}
        setOpen={setOpenEditProfileCoverDialog}
        isRemovingCover={isRemovingCover}
      />

      <EditProfileInfoDialog
        open={openEditProfileDetailsDialog}
        setOpen={setOpenProfileDetailsDialog}
      />
    </div >
  );
};

export default ProfileHeader;