import { useState } from "react";
import moment from "moment";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { UseFormReturn, } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Schema_HistoryMySwapsFiltersForm } from "@/schema";

import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { IHistoryFilters, SUT_FiltersSwapModeType, SUT_HistoryFiltersStatusType } from "@/types/my-swaps-store.types";
import { Switch } from "@/components/ui/switch";
import { useMySwapStore } from "@/store/my-swaps";
import CustomOutlineButton from "../shared/CustomOutlineButton";

interface IProp {
  children: any;
  formKey: string;
  setFormKey: React.Dispatch<React.SetStateAction<string>>;
  handleResetAppliedFilters: (resetType: "all" | "swap-mode" | "swap-status" | "current-chain" | "request-date") => void;
  historySwapsForm: UseFormReturn<{
    swapStatus: "all" | "completed" | "declined" | "canceled";
    swapMode: "all" | "open-market" | "private-party";
    offersFromCurrentChain?: boolean | undefined;
    requestedDate?: Date | undefined;
  }, any, undefined>;
}

const HistorySwapsFilterDrawer = ({ children, formKey, setFormKey, handleResetAppliedFilters, historySwapsForm }: IProp) => {
  const [isOpen, setIsOpen] = useState(false);

  const [setFilteredHistorySwapByFilters] = useMySwapStore(state => [state.setFilteredHistorySwapByFilters]);

  const swapModeFilterFormData: SUT_FiltersSwapModeType[] = ["all", 'open-market', 'private-party'];
  const swapStatusFilterFormData: SUT_HistoryFiltersStatusType[] = ["all", "completed", "declined", "canceled"];

  const onSubmit = async (data: z.infer<typeof Schema_HistoryMySwapsFiltersForm>) => {
    const { requestedDate, swapMode, swapStatus, offersFromCurrentChain } = data;

    const newHistoryFilters: IHistoryFilters = {
      offersFromCurrentChain: offersFromCurrentChain ? offersFromCurrentChain : false,
      requestedDate: requestedDate ? moment.utc(requestedDate).format() : '',
      swapMode: swapMode ? swapMode : 'all',
      swapStatus: swapStatus ? swapStatus : 'all'
    };

    setFilteredHistorySwapByFilters(newHistoryFilters);
    setIsOpen(false);
  };

  return (
    <>
      <Drawer open={isOpen} direction="right" onClose={() => setIsOpen(false)}  >
        <DrawerTrigger onClick={() => setIsOpen(true)}>
          {children}
        </DrawerTrigger>

        <DrawerContent
          className="p-3 h-screen w-11/12 lg:w-1/3 right-0 bg-transparent"
        >
          <DrawerClose
            className="bg-transparent fixed top-0 left-[-10%] lg:left-[-200%] h-screen w-[25vw] lg:w-[67vw]"
            onClose={() => setIsOpen(false)}
          ></DrawerClose>

          <div className="rounded-sm h-full w-full bg-su_secondary_bg flex flex-col gap-4 p-4" >
            <DrawerTitle className="text-su_primary" >
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-xl pt-2" >Filter options</h2>
                <DrawerClose className="p-1 rounded-xs hover:bg-su_active_bg" onClick={() => setIsOpen(false)} >
                  <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </DrawerClose>
              </div>

              <p className="text-su_secondary text-base font-medium" >Refine your search with custom filters:</p>
            </DrawerTitle>

            <div className="h-full space-y-2">
              <Form {...historySwapsForm} key={formKey} >
                <form className="h-full flex flex-col justify-between pb-4" onSubmit={historySwapsForm.handleSubmit(onSubmit)}>
                  <div className="space-y-3" >
                    <FormField
                      control={historySwapsForm.control}
                      name="offersFromCurrentChain"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2" >
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id={field.name}
                          />

                          <FormLabel htmlFor={field.name} className="cursor-pointer text-su_secondary text-sm font-normal flex items-center justify-between">
                            Show offers from only current chain:
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Swap Status */}
                    <FormField
                      control={historySwapsForm.control}
                      name="swapStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-su_secondary text-sm font-normal flex items-center justify-between">
                            Status:

                            <button
                              onClick={() => handleResetAppliedFilters('swap-status')}
                              type="reset"
                              className="flex items-center gap-2 py-1 px-2 rounded-sm hover:bg-su_active_bg"
                            >
                              <svg className="w-3" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 12C4.46667 12 3.13067 11.4918 1.992 10.4753C0.853333 9.45889 0.200444 8.18933 0.0333333 6.66667H1.4C1.55556 7.82222 2.06956 8.77778 2.942 9.53333C3.81444 10.2889 4.83378 10.6667 6 10.6667C7.3 10.6667 8.40289 10.214 9.30867 9.30867C10.2144 8.40333 10.6671 7.30045 10.6667 6C10.6662 4.69956 10.2136 3.59689 9.30867 2.692C8.40378 1.78711 7.30089 1.33422 6 1.33333C5.23333 1.33333 4.51667 1.51111 3.85 1.86667C3.18333 2.22222 2.62222 2.71111 2.16667 3.33333H4V4.66667H0V0.666667H1.33333V2.23333C1.9 1.52222 2.59178 0.972222 3.40867 0.583333C4.22556 0.194444 5.08933 0 6 0C6.83333 0 7.614 0.158445 8.342 0.475333C9.07 0.792222 9.70333 1.21978 10.242 1.758C10.7807 2.29622 11.2084 2.92956 11.5253 3.658C11.8422 4.38645 12.0004 5.16711 12 6C11.9996 6.83289 11.8413 7.61356 11.5253 8.342C11.2093 9.07045 10.7816 9.70378 10.242 10.242C9.70244 10.7802 9.06911 11.208 8.342 11.5253C7.61489 11.8427 6.83422 12.0009 6 12Z" fill="#B6B6BD" />
                              </svg>

                              Reset
                            </button>
                          </FormLabel>
                          <ToggleGroup
                            type="single"
                            className="w-[320px]"
                            onValueChange={field.onChange} defaultValue={field.value}
                          >
                            {swapStatusFilterFormData.map(status => (
                              <ToggleGroupItem
                                key={status}
                                value={status}
                                aria-label="Toggle bold"
                                className="capitalize"
                              >
                                {status}
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Swap Mode */}
                    <FormField
                      control={historySwapsForm.control}
                      name="swapMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-su_secondary text-sm font-normal flex items-center justify-between">
                            Swap mode:

                            <button
                              onClick={() => handleResetAppliedFilters('swap-mode')}
                              type="reset"
                              className="flex items-center gap-2 py-1 px-2 rounded-sm hover:bg-su_active_bg"
                            >
                              <svg className="w-3" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 12C4.46667 12 3.13067 11.4918 1.992 10.4753C0.853333 9.45889 0.200444 8.18933 0.0333333 6.66667H1.4C1.55556 7.82222 2.06956 8.77778 2.942 9.53333C3.81444 10.2889 4.83378 10.6667 6 10.6667C7.3 10.6667 8.40289 10.214 9.30867 9.30867C10.2144 8.40333 10.6671 7.30045 10.6667 6C10.6662 4.69956 10.2136 3.59689 9.30867 2.692C8.40378 1.78711 7.30089 1.33422 6 1.33333C5.23333 1.33333 4.51667 1.51111 3.85 1.86667C3.18333 2.22222 2.62222 2.71111 2.16667 3.33333H4V4.66667H0V0.666667H1.33333V2.23333C1.9 1.52222 2.59178 0.972222 3.40867 0.583333C4.22556 0.194444 5.08933 0 6 0C6.83333 0 7.614 0.158445 8.342 0.475333C9.07 0.792222 9.70333 1.21978 10.242 1.758C10.7807 2.29622 11.2084 2.92956 11.5253 3.658C11.8422 4.38645 12.0004 5.16711 12 6C11.9996 6.83289 11.8413 7.61356 11.5253 8.342C11.2093 9.07045 10.7816 9.70378 10.242 10.242C9.70244 10.7802 9.06911 11.208 8.342 11.5253C7.61489 11.8427 6.83422 12.0009 6 12Z" fill="#B6B6BD" />
                              </svg>

                              Reset
                            </button>
                          </FormLabel>
                          <ToggleGroup
                            type="single"
                            className="w-[270px]"
                            onValueChange={field.onChange} defaultValue={field.value}
                          >
                            {swapModeFilterFormData.map(mode => (
                              <ToggleGroupItem
                                key={mode}
                                value={mode}
                                aria-label="Toggle bold"
                                className="capitalize"
                              >
                                {mode.replace('-', ' ')}
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Requested Data */}
                    <FormField
                      control={historySwapsForm.control}
                      name="requestedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor={field.name} className="cursor-pointer text-su_secondary text-sm font-normal">Expiration date:</FormLabel>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id={field.name}
                                variant={"outline"}
                                className={cn(
                                  "w-full flex justify-between items-center text-left font-normal bg-su_enable_bg rounded-sm text-su_secondary text-sm"
                                )}
                              >
                                {field.value ?
                                  <span className="text-su_primary" >{moment(field.value).format('MMM DD, YYYY HH:mm A')}</span>
                                  :
                                  (
                                    <span>Set expiration date</span>
                                  )}
                                <CalendarIcon className="w-4" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="!w-[280px]" align="center">
                              <Calendar
                                initialFocus
                                mode="single"
                                defaultMonth={field.value || undefined}
                                selected={field.value}
                                onSelect={field.onChange}
                                numberOfMonths={1}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full grid grid-cols-2 gap-4" >
                    <CustomOutlineButton
                      onClick={() => handleResetAppliedFilters('all')}
                    >
                      Clear filters
                    </CustomOutlineButton>
                    <Button variant={"default"} type="submit" >Apply filters</Button>
                  </div>

                </form>
              </Form>

            </div>
          </div>

        </DrawerContent>

      </Drawer >
    </>
  );
};

export default HistorySwapsFilterDrawer;