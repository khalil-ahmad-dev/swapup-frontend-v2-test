import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfileStore } from '@/store/profile';
import { useEffect, useState } from 'react';
import { handleCheckSubnameAvailability } from '@/lib/minting';
import { handleShowNotificationToast } from '@/lib/helpers';


interface IProp {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  handleNavigationOfSteps: (navigationMode: "NEXT" | "PREVIOUS") => void;
}

const formSchema = z.object({
  subname: z.string()
    .min(1, {
      message: "Subname is required.",
    })
    .regex(/^[a-z](?:[a-z0-9-]*[a-z0-9])?$/, {
      message:
        "Subname must start with a lowercase letter, can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.",
    }),
});

const CreateNewSubnameDialog = ({ open, setOpen, handleNavigationOfSteps }: IProp) => {

  const [isLoading, setIsLoading] = useState(false);

  const [name, setSubnameValue, subname, wallet] = useProfileStore(state => [
    state.overviewTab.subdomainSection.createNewSubdomain.name,
    state.overviewTab.subdomainSection.createNewSubdomain.setSubnameValue,
    state.overviewTab.subdomainSection.createNewSubdomain.subname,
    state.profile.wallet
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subname: subname || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubnameValue(values.subname);

    try {
      setIsLoading(true);
      const isAvailable = await handleCheckSubnameAvailability(values.subname);

      if (isAvailable) {
        handleNavigationOfSteps("NEXT");
      } else {
        form.setError("subname", {
          type: "manual",
          message: "Subname is not available.",
        });
      }

    } catch (error: any) {
      handleShowNotificationToast(
        "error",
        `Request failed!`,
        `${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      form.reset();
      form.setValue("subname", subname);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="w-[400px] p-4" >
        <div className="space-y-3" >
          {/* header */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-xl pt-3" >Create subname</h2>

              <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </DialogClose>
            </div>

            <p className="text-base font-medium text-secondary dark:text-su_secondary">Enter the name for your subdomain</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="subname"
                render={({ field }) => (
                  <FormItem className="space-y-2" >
                    <FormControl>
                      <Input
                        className="!bg-su_enable_bg py-3.5 px-4"
                        placeholder="Enter subname"
                        suffix={name}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button variant={"default"} type="submit" className='w-full' isLoading={isLoading} >
                Next
              </Button>

            </form>
          </Form>

        </div>
      </DialogContent>
    </Dialog >
  );
};

export default CreateNewSubnameDialog;