import CustomOutlineButton from "@/components/custom/shared/CustomOutlineButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { useProfileStore } from "@/store/profile";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Schema_EditSubdomainRecordsForm } from "@/schema";
import { SUT_EditSubdomainRecordsTabType } from "@/types/profile-store.types";
import { Twitter, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SUI_SubnameRecordAddressItem } from "@/types/profile.types";
import CustomIconButton from "@/components/custom/shared/CustomIconButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface IProp {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}

const EditRecordsDialog = ({ open, setOpen }: IProp) => {
  const [availableSubnames] = useProfileStore(state => [
    state.overviewTab.subdomainSection.availableSubnames,
  ]);

  const primarySubname = availableSubnames.find(subname => subname.isPrimary === true);

  const recordTabs: SUT_EditSubdomainRecordsTabType[] = ['text', 'address', 'other'];

  const form = useForm<z.infer<typeof Schema_EditSubdomainRecordsForm>>({
    resolver: zodResolver(Schema_EditSubdomainRecordsForm),
    defaultValues: {
      recordTab: 'address',
      addresses: [""],
      contentHash: undefined,
      text: undefined
    }
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "addresses" as never, });

  const onSubmit = (values: z.infer<typeof Schema_EditSubdomainRecordsForm>) => {
    console.log(values);
  };

  const addressDataset: SUI_SubnameRecordAddressItem[] = [
    {
      uuid: "ethereum",
      address: "",
      name: "ethereum",
      symbol: "ETH",
      iconUrl: "/assets/svgs/ethereum.svg"
    },
    {
      uuid: "base",
      address: "",
      name: "base",
      symbol: "BASE",
      iconUrl: "/assets/svgs/base.svg"
    },
    {
      uuid: "matic",
      address: "",
      name: "matic",
      symbol: "MATIC",
      iconUrl: "/assets/svgs/Matic.svg"
    },
    {
      uuid: "solana",
      address: "",
      name: "solana",
      symbol: "SOL",
      iconUrl: "/assets/svgs/solana-green.svg"
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="w-[400px] p-4" >
        <div className="space-y-3" >
          {/* header */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-xl pt-3" >{primarySubname?.fullName} records </h2>

              <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </DialogClose>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="recordTab"
              render={({ field }) => (
                <FormItem>
                  <Tabs onValueChange={field.onChange} defaultValue={field.value}>
                    <TabsList>
                      {recordTabs.map(tab => (
                        <TabsTrigger key={tab} value={tab} className='capitalize' >
                          {tab}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <FormMessage />
                </FormItem>
              )}
            />

            {
              form.watch("recordTab") === "text" &&
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem className="space-y-2" >
                    <FormControl>
                      <Input
                        className="!bg-su_enable_bg py-3.5 px-4"
                        placeholder="Enter subname"
                        icon={
                          <img src="/assets/svgs/TwitterX.svg" className="size-4" />
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            }

            {
              form.watch("recordTab") === "address" &&
              <ScrollArea className="h-[73%] pr-2" >
                <div className="space-y-2" >
                  {fields.map((field, index) => (
                    <FormField
                      control={form.control}
                      name={`addresses.${index}`}
                      render={({ field }) => (
                        <FormItem className="space-y-1" >
                          <FormLabel htmlFor={field.name} className="text-su_secondary text-sm font-normal">{addressDataset[index].symbol}</FormLabel>
                          <FormControl>
                            <div className="flex items-center justify-between" >
                              <Input
                                className="!bg-su_enable_bg py-3.5 px-4 w-[90%]"
                                placeholder="Add address here..."
                                icon={
                                  <img src={addressDataset[index].iconUrl} className="size-4" />
                                }
                                {...field}
                              />

                              <CustomIconButton
                                className="w-8 h-8 flex items-center justify-center group text-su_disabled"
                                onClick={() => { remove(index); }}
                              >
                                <svg className="w-3 group-hover:text-su_negative" viewBox="0 0 12 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 0.888889H9L8.14286 0H3.85714L3 0.888889H0V2.66667H12M0.857143 14.2222C0.857143 14.6937 1.03775 15.1459 1.35925 15.4793C1.68074 15.8127 2.11677 16 2.57143 16H9.42857C9.88323 16 10.3193 15.8127 10.6408 15.4793C10.9622 15.1459 11.1429 14.6937 11.1429 14.2222V3.55556H0.857143V14.2222Z" fill="currentColor" />
                                </svg>
                              </CustomIconButton>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  ))
                  }
                </div>

                <button
                  onClick={() => append('')}
                  className="mt-6 flex items-center gap-2 cursor-pointer text-sm text-su_disabled font-semibold disabled:cursor-not-allowed"
                  disabled={form.watch('addresses')?.length === 4}
                >
                  <svg className="w-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.74764 0.996582V0.246582H5.24764V0.996582V5.24834H0.996094H0.246094V6.74834H0.996094H5.24764V11.0004V11.7504H6.74764V11.0004V6.74834H10.9999H11.7499V5.24834H10.9999H6.74764V0.996582Z" fill="#565665" />
                  </svg>

                  Add Address
                </button>

                <ScrollBar orientation="vertical" className="bg-transparent" />
              </ScrollArea>
            }

            {
              form.watch("recordTab") === "other" &&
              <FormField
                control={form.control}
                name="contentHash"
                render={({ field }) => (
                  <FormItem className="space-y-1" >
                    <FormLabel htmlFor={field.name} className="text-su_secondary text-sm font-normal">Content Hash</FormLabel>
                    <FormControl>
                      <Input
                        className="!bg-su_enable_bg py-3.5 px-4"
                        placeholder="e.g. ipfs://"
                        id={field.name}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            }

            <div className="w-full grid grid-cols-2 gap-4 py-2" >
              <CustomOutlineButton
                containerClasses="w-full h-full"
                onClick={() => (setOpen(false))}
              >
                Cancel
              </CustomOutlineButton>

              <Button variant={"default"} type="submit" >
                Save
              </Button>
            </div>

          </form>
        </Form>

      </DialogContent>
    </Dialog >
  );
};

export default EditRecordsDialog;