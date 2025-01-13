import { cn, generateRandomKey, getAspectRatio } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";


import { z } from "zod";
import { useProfileStore } from "@/store/profile";
import CustomOutlineButton from "../shared/CustomOutlineButton";
import { Input } from "@/components/ui/input";
import { Schema_ProfileEditCoverImageForm } from "@/schema";
import { defaults } from "@/constants/defaults";
import { useEffect, useState } from "react";
import { SUI_UploadProfilePicturePayload } from "@/types/profile.types";
import { uploadProfilePictureApi } from "@/service/api/user.service";
import { handleShowNotificationToast } from "@/lib/helpers";

interface IProp {
  handleRemoveProfileCoverImage: () => void;
  form: UseFormReturn<{
    coverImage?: File | undefined;
  }, any, undefined>;
  editCoverFormKey: string;
  currentEditCover: string;
  setEditCoverFormKey: React.Dispatch<React.SetStateAction<string>>;
  setCurrentEditCover: React.Dispatch<React.SetStateAction<string>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRemovingCover: boolean;
}


const EditProfileCoverImageDialog = ({ currentEditCover, editCoverFormKey, form, handleRemoveProfileCoverImage, setCurrentEditCover, setEditCoverFormKey, open, setOpen, isRemovingCover }: IProp) => {

  const [setProfileCoverImage, profile] = useProfileStore(state => [state.setProfileCoverImage, state.profile]);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const { errors } = form.formState;

  const onSubmit = async (values: z.infer<typeof Schema_ProfileEditCoverImageForm>) => {
    const { coverImage } = values;

    try {
      setIsUploadingCover(true);

      if (coverImage) {
        const payload: SUI_UploadProfilePicturePayload = {
          file: coverImage,
          pictureType: 'profile-cover',
          walletId: profile.wallet.address
        };

        const response = await uploadProfilePictureApi(payload);
        // console.log("Image Upload res: ", response);

        if (response.data.url) {
          handleShowNotificationToast(
            'success',
            "Cover updated successfully!",
            'Your profile cover image is updated.'
          );

          setProfileCoverImage(currentEditCover);
          // Closing dialog
          setOpen(false);
        }
      }

    } catch (error: any) {
      handleShowNotificationToast(
        'error',
        "Error while updating cover",
        error.message
      );

    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSelectedImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let file: File;

    if (event.target && event.target.files && event.target.files.length > 0) {
      file = event.target.files[0];
    } else { return; }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      // Aspect ratio validation

      // const aspectRatio = getAspectRatio(img.width, img.height);
      // const desiredAspectRatio = getAspectRatio(1226, 156);

      // if (Math.abs(aspectRatio - desiredAspectRatio) > 0.01) {
      //   form.setError("coverImage", {
      //     type: "manual",
      //     message: "The image aspect ratio must be approximately 7.86:1",
      //   });
      //   return;
      // }

      form.setValue("coverImage", file);
      const isValid = await form.trigger();
      if (!isValid) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setCurrentEditCover(reader.result as string);
      };
    };
  };

  useEffect(() => {
    if (!open) {
      // Reset the form and clear the cover when the dialog is closed
      form.reset({
        coverImage: undefined,
      });
      setEditCoverFormKey(generateRandomKey(6));
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[400px] p-4 px-6" >
        <div className="space-y-3" >
          {/* header */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-xl pt-3" >Change your profile cover image </h2>

              <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </DialogClose>
            </div>

            <p className="text-base font-medium text-secondary dark:text-su_secondary">Upload an image for profile cover.</p>
          </div>

          <Form {...form} key={editCoverFormKey}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 items-center">

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center" >
                    <div className="relative" >
                      <Input
                        className="absolute z-10 w-full h-full rounded-full top-0 left-0 bg-transparent opacity-0 !cursor-pointer"
                        placeholder="select image"
                        id={field.name}
                        type="file"
                        accept="image/*"
                        onChange={(event) => { handleSelectedImage(event); }}
                      />

                      <img
                        src={currentEditCover ? currentEditCover : defaults.fallback.profileCover}
                        alt=""
                        className="w-96 h-32 object-cover rounded-xs"
                      />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-center items-center gap-3" >
                <CustomOutlineButton
                  className="px-[20px] py-2"
                  disabled={!currentEditCover}
                  isLoading={isRemovingCover}
                  onClick={handleRemoveProfileCoverImage}
                  type="button"
                >
                  Remove
                </CustomOutlineButton>

                <div className="relative" >
                  <CustomOutlineButton
                    className="px-[20px] py-2"
                    type="button"
                  >
                    Replace
                  </CustomOutlineButton>

                  <FormLabel htmlFor="coverImage" className="absolute top-0 left-0 w-full h-full cursor-pointer" />
                </div>
              </div>

              <FormLabel
                htmlFor="profileImage"
                className="text-su_secondary text-sm font-semibold cursor-pointer"
              >
                Image requirements: .jpeg, jpg, .png or .gif file.

                <span className="block text-center" >
                  <span className="text-su_primary" >Note: </span>  Aspect ratio around 7.86:1
                </span>
              </FormLabel>

              <Button
                type="submit"
                className="w-full"
                disabled={!form.watch('coverImage') && !errors.coverImage?.message}
                isLoading={isUploadingCover}
              >
                Apply Changes
              </Button>

            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog >
  );
};

export default EditProfileCoverImageDialog;