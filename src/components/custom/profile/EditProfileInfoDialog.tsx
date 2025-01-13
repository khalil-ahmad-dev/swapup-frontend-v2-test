import { useState } from "react";
import { Drawer, DrawerContent, DrawerTitle, DrawerClose, } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Schema_ProfileInfoForm } from "@/schema";
import { Textarea } from "@/components/ui/textarea";
import CustomIconButton from "../shared/CustomIconButton";
import { generateRandomKey } from "@/lib/utils";
import { useProfileStore } from "@/store/profile";
import { IProfileDetails, SUI_UpdateProfileDetailsPayload } from "@/types/profile.types";
import { updatedUserProfileDetailsApi } from "@/service/api/user.service";
import { handleShowNotificationToast } from "@/lib/helpers";


interface IProp {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfileInfoDialog = ({ open, setOpen }: IProp) => {
  const [formKey, setFormKey] = useState(generateRandomKey(6));
  const [isUpdating, setIsUpdating] = useState(false);

  const [setProfileDetails, profileDetails, wallet] = useProfileStore(state => [state.setProfileDetails, state.profile.details, state.profile.wallet]);

  const form = useForm<z.infer<typeof Schema_ProfileInfoForm>>({
    resolver: zodResolver(Schema_ProfileInfoForm),
    defaultValues: {
      title: profileDetails?.title || '',
      description: profileDetails?.description || '',
      twitterLink: profileDetails?.twitter || undefined,
      warpcastLink: profileDetails?.warpcast || undefined
    }
  });

  const onSubmit = async (data: z.infer<typeof Schema_ProfileInfoForm>) => {

    const details: IProfileDetails = {
      title: data.title,
      description: data.description ? data.description : '',
      twitter: data.twitterLink,
      warpcast: data.warpcastLink
    };

    const payload: SUI_UpdateProfileDetailsPayload = {
      walletId: wallet.address,
      title: details.title,
      description: details.description,
      social_links: {
        twitter: details.twitter ? details.twitter : '',
        warpcast: details.twitter ? details.twitter : ''
      }
    };

    try {
      setIsUpdating(true);
      const updatedRes = await updatedUserProfileDetailsApi(payload);

      if (updatedRes) {

        handleShowNotificationToast(
          'success',
          "Profile updated successfully!",
          'Your profile details are updated.'
        );

        setProfileDetails(details);
        setOpen(false);
        setFormKey(generateRandomKey(6));
      }

    } catch (error: any) {

      handleShowNotificationToast(
        'error',
        "Error while updating profile details",
        error.message
      );

    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveSocialLink = (linkKey: "warpcastLink" | "twitterLink") => {
    form.setValue(linkKey, '');
  };

  return (
    <>
      <Drawer open={open} direction="right" onClose={() => setOpen(false)}  >
        <DrawerContent
          className="p-3 h-screen w-9/12 lg:w-1/3 right-0 bg-transparent"
        >
          <DrawerClose
            className="bg-transparent fixed top-0 left-[-30%] lg:left-[-200%] h-screen w-[25vw] lg:w-[67vw]"
            onClose={() => setOpen(false)}
          ></DrawerClose>

          <div className="rounded-sm h-full w-full bg-su_secondary_bg flex flex-col gap-4 p-4" >
            <DrawerTitle className="text-su_primary" >
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-xl pt-2" >Edit profile</h2>
                <DrawerClose className="p-1 rounded-xs hover:bg-su_active_bg" onClick={() => setOpen(false)} >
                  <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </DrawerClose>
              </div>
            </DrawerTitle>

            <div className="h-full space-y-2">
              <Form {...form} key={formKey}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-full pb-9 flex flex-col justify-between" >

                  <div className="space-y-4" >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel htmlFor={field.name} >Profile title:</FormLabel>
                          <Input
                            className="bg-su_button_disabled px-4 py-3 "
                            placeholder="Enter your title"
                            id={field.name}
                            onChange={field.onChange}
                            value={field.value}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem >
                          <FormLabel>Profile description:</FormLabel>

                          <Textarea
                            className="bg-su_button_disabled p-4"
                            placeholder="Set your profile description here"
                            id={field.name}
                            onChange={field.onChange}
                            value={field.value}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col gap-2">
                      <FormLabel>Social media links:</FormLabel>
                      <div className="flex flex-col gap-3" >
                        <div className="w-full flex items-center gap-2" >
                          <FormField
                            control={form.control}
                            name="twitterLink"
                            render={({ field }) => (
                              <FormItem className="w-full" >
                                <Input
                                  className="bg-su_button_disabled px-4 py-3 "
                                  icon={
                                    <svg className="w-4" viewBox="0 0 16 16" fill="currentcolor" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M15.0546 0L9.69196 6.77714L16 16H11.061L7.19664 10.4057L2.76913 16H0.315144L6.04973 8.74857L0 0H5.06296L8.56054 5.11429L12.6006 0H15.0546ZM13.1017 14.3771L4.32418 1.53714H2.86212L11.7378 14.3771H13.0965H13.1017Z" fill="currentcolor" />
                                    </svg>
                                  }
                                  placeholder="Enter your twitter link"
                                  id={field.name}
                                  onChange={field.onChange}
                                  value={field.value}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <CustomIconButton
                            title="remove twitter link"
                            className="px-2.5"
                            onClick={() => handleRemoveSocialLink('twitterLink')}
                          >
                            <svg className="w-2.5" viewBox="0 0 10 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.66634 0.666667H7.33301L6.66634 0H3.33301L2.66634 0.666667H0.333008V2H9.66634M0.999674 10.6667C0.999674 11.0203 1.14015 11.3594 1.3902 11.6095C1.64025 11.8595 1.97939 12 2.33301 12H7.66634C8.01996 12 8.3591 11.8595 8.60915 11.6095C8.8592 11.3594 8.99967 11.0203 8.99967 10.6667V2.66667H0.999674V10.6667Z" fill="currentColor" />
                            </svg>
                          </CustomIconButton>
                        </div>

                        <div className="w-full flex items-center gap-2" >
                          <FormField
                            control={form.control}
                            name="warpcastLink"
                            render={({ field }) => (
                              <FormItem className="w-full" >
                                <Input
                                  className="bg-su_button_disabled px-4 py-3 "
                                  icon={
                                    <svg className="w-4" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M2.74557 0H13.0651V16H11.5503V8.67097H11.5354C11.368 6.6454 9.80668 5.05805 7.90532 5.05805C6.00397 5.05805 4.44264 6.6454 4.2752 8.67097H4.26036V16H2.74557V0Z" fill="currentColor" />
                                      <path d="M0 2.27095L0.615387 4.54193H1.13609V13.729C0.874651 13.729 0.662719 13.9601 0.662719 14.2452V14.8645H0.568054C0.306618 14.8645 0.0946648 15.0956 0.0946648 15.3807V16H5.39644V15.3807C5.39644 15.0956 5.18451 14.8645 4.92308 14.8645H4.82841V14.2452C4.82841 13.9601 4.61646 13.729 4.35502 13.729H3.78699V2.27095H0Z" fill="currentColor" />
                                      <path d="M11.645 13.729C11.3835 13.729 11.1716 13.9601 11.1716 14.2452V14.8645H11.0769C10.8155 14.8645 10.6036 15.0956 10.6036 15.3807V16H15.9053V15.3807C15.9053 15.0956 15.6934 14.8645 15.4319 14.8645H15.3373V14.2452C15.3373 13.9601 15.1253 13.729 14.8639 13.729V4.54193H15.3846L16 2.27095H12.213V13.729H11.645Z" fill="currentColor" />
                                    </svg>

                                  }
                                  placeholder="Enter your warpcast link"
                                  id={field.name}
                                  onChange={field.onChange}
                                  value={field.value}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <CustomIconButton
                            title="remove warpcast link"
                            className="px-2.5"
                            onClick={() => handleRemoveSocialLink('warpcastLink')}
                          >
                            <svg className="w-2.5" viewBox="0 0 10 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.66634 0.666667H7.33301L6.66634 0H3.33301L2.66634 0.666667H0.333008V2H9.66634M0.999674 10.6667C0.999674 11.0203 1.14015 11.3594 1.3902 11.6095C1.64025 11.8595 1.97939 12 2.33301 12H7.66634C8.01996 12 8.3591 11.8595 8.60915 11.6095C8.8592 11.3594 8.99967 11.0203 8.99967 10.6667V2.66667H0.999674V10.6667Z" fill="currentColor" />
                            </svg>
                          </CustomIconButton>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant={"default"} isLoading={isUpdating} type="submit" className="w-full" >Save changes</Button>
                </form>
              </Form>
            </div>


          </div>

        </DrawerContent>

      </Drawer >
    </>
  );
};

export default EditProfileInfoDialog;