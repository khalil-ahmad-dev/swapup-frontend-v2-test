import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { cn, generateRandomKey, getDefaultNftImageOnError } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, } from "react-hook-form";
import { z } from "zod";

import { SUI_CurrencyChainItem } from "@/types/global.types";

import { Input } from "@/components/ui/input";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGlobalStore } from "@/store/global-store";
import { defaults } from "@/constants/defaults";
import { currentChain } from "@/lib/thirdWebClient";
import { Environment } from "@/config";
import { SUE_CHAIN_ID } from "@/constants/enums";

interface IProp {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetSelectedCurrency: (selectedCurrencyValue: string) => void;
}

const CurrencyTokenSelectDialog = ({ open, setOpen, handleSetSelectedCurrency }: IProp) => {

  // This following array represents preferred currencies which will be shown in top section
  const preferredCurrenciesToBeFiltered = defaults.getPreferredCurrencySymbols();

  const [preferredCurrenciesList, setPreferredCurrenciesList] = useState<SUI_CurrencyChainItem[]>([]);
  const [notPreferredCurrenciesList, setNotPreferredCurrenciesList] = useState<SUI_CurrencyChainItem[]>([]);
  const [filteredNotPreferredCurrenciesList, setFilteredNotPreferredCurrenciesList] = useState<SUI_CurrencyChainItem[]>([]);

  const [filteredAvailableCurrencies] = useGlobalStore(state => [state.filteredAvailableCurrencies]);

  const tokenSelectFormSchema = z.object({
    preferredToken: z.string().optional(),
    notPreferredToken: z.string().optional()
  });

  const form = useForm<z.infer<typeof tokenSelectFormSchema>>({
    resolver: zodResolver(tokenSelectFormSchema),
    defaultValues: {
      preferredToken: '',
      notPreferredToken: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof tokenSelectFormSchema>) => { };

  const handleSearchFilterNotPreferredCurrenciesList = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();

    const newFilteredNotPreferredCurrencyList = notPreferredCurrenciesList.filter(currency => {
      const currencyContractAddresses = (currency.contractAddresses as string[]).find(currency => currency.startsWith((currentChain.id || Environment.CHAIN_ID) === SUE_CHAIN_ID.BASE ? "base" : "ethereum"));

      return (
        currency.name.toLowerCase().includes(searchValue) ||
        currencyContractAddresses?.includes(searchValue)
      );
    });

    setFilteredNotPreferredCurrenciesList(newFilteredNotPreferredCurrencyList);
  };

  useEffect(() => {

    if (filteredAvailableCurrencies.length > 0) {
      const newPreferredList = filteredAvailableCurrencies.filter(currency => preferredCurrenciesToBeFiltered.find(symbol => currency.symbol === symbol));
      const newNotPreferredList = filteredAvailableCurrencies.filter(currency => !preferredCurrenciesToBeFiltered.find(symbol => currency.symbol === symbol));
      setPreferredCurrenciesList(newPreferredList);
      setNotPreferredCurrenciesList(newNotPreferredList);
      setFilteredNotPreferredCurrenciesList(newNotPreferredList);
    }

    form.reset();

  }, [filteredAvailableCurrencies]);


  useEffect(() => {
    const handleSetCurrency = async () => {
      const isValidForm = await form.trigger();
      const preferredSelectedCurrency = form.watch('preferredToken');
      const NotPreferredSelectedCurrency = form.watch('notPreferredToken');

      if (isValidForm && preferredSelectedCurrency) {
        handleSetSelectedCurrency(preferredSelectedCurrency);
        setOpen(false);
      }

      if (isValidForm && NotPreferredSelectedCurrency) {
        handleSetSelectedCurrency(NotPreferredSelectedCurrency);
        setOpen(false);
      }
    };

    handleSetCurrency();

  }, [form.watch('preferredToken'), form.watch("notPreferredToken")]);


  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="w-[400px] p-4" >
        <div className="space-y-3" >
          {/* header */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-bold text-xl pt-3" >Select token </h2>

              <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </DialogClose>
            </div>
          </div>

          <Form {...form} >
            <form className="h-full pb-4 " onSubmit={form.handleSubmit(onSubmit)}>

              <Input
                className="w-full bg-su_enable_bg text-su_secondary !p-3.5 mr-1 mb-3"
                placeholder="Search by currency name or past token address"
                onChange={handleSearchFilterNotPreferredCurrenciesList}
                icon={
                  <svg className="w-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 14.6154L11.2277 9.84231C11.9968 8.78544 12.4105 7.5117 12.4092 6.20462C12.4092 2.78346 9.62577 0 6.20462 0C2.78346 0 0 2.78346 0 6.20462C0 9.62577 2.78346 12.4092 6.20462 12.4092C7.5117 12.4105 8.78544 11.9968 9.84231 11.2277L14.6154 16L16 14.6154ZM6.20462 10.4496C5.36493 10.4497 4.54407 10.2008 3.84586 9.7343C3.14765 9.26784 2.60345 8.60481 2.28208 7.82905C1.96071 7.05329 1.8766 6.19965 2.0404 5.37609C2.2042 4.55253 2.60854 3.79604 3.20229 3.20229C3.79604 2.60854 4.55253 2.2042 5.37609 2.0404C6.19965 1.8766 7.05329 1.96071 7.82905 2.28208C8.60481 2.60345 9.26784 3.14765 9.7343 3.84586C10.2008 4.54407 10.4497 5.36493 10.4496 6.20462C10.4483 7.33005 10.0006 8.40902 9.20482 9.20482C8.40902 10.0006 7.33005 10.4483 6.20462 10.4496Z" fill="#868691" />
                  </svg>
                }
              />

              <div className="space-y-4" >
                <FormField
                  control={form.control}
                  name="preferredToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className=""
                        >
                          <div className="flex items-center gap-2 flex-wrap p-1">
                            {preferredCurrenciesList.map((currency, index) => {
                              const currentValue = JSON.stringify(currency);
                              return (
                                <FormItem key={currency.uuid + currency.iconUrl + index} className="p-0">
                                  <FormControl><RadioGroupItem id={currentValue} value={currentValue} className="hidden" /></FormControl>

                                  <FormLabel
                                    htmlFor={currentValue}
                                    className={cn(
                                      "!-mt-[1px] flex items-center gap-2 cursor-pointer text-xs text-su_primary bg-su_enable_bg py-2 px-2.5 rounded-full",
                                      field.value === currentValue && "border-2 border-su_active_bg bg-su_enable_bg"
                                    )}
                                  >
                                    <img
                                      src={currency.iconUrl}
                                      alt=""
                                      className="w-4 h-4"
                                      loading="lazy"
                                      onError={(e: any) => {
                                        e.currentTarget.className = "w-4 h-4 rounded-full object-cover";
                                        getDefaultNftImageOnError(e);
                                      }}
                                    />

                                    {currency.symbol}
                                  </FormLabel>
                                </FormItem>
                              );
                            })}
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-b-[1px] border-b-su_enable_bg" ></div>

                <ScrollArea className="h-[200px]" >
                  <p>Popular tokens</p>

                  <FormField
                    control={form.control}
                    name="notPreferredToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className=""
                          >
                            <div className="flex items-center gap-2 flex-wrap p-1">
                              {filteredNotPreferredCurrenciesList.map((currency, index) => {
                                const currentValue = JSON.stringify(currency);
                                return (
                                  <FormItem
                                    key={currency.uuid + currency.iconUrl + index}
                                    className={cn(
                                      "p-2 w-full bg-transparent cursor-pointer hover:bg-su_disabled rounded-xs",
                                      field.value === currentValue && "border-2 border-su_active_bg "
                                    )}
                                  >
                                    <FormControl><RadioGroupItem id={currentValue} value={currentValue} className="hidden" /></FormControl>

                                    <FormLabel
                                      htmlFor={currentValue}
                                      className={cn(
                                        "flex gap-3",
                                      )}
                                    >
                                      <img
                                        src={currency.iconUrl}
                                        alt=""
                                        className="w-6 h-6 mt-1"
                                        loading="lazy"
                                        onError={(e: any) => {
                                          e.currentTarget.className = "w-6 h-6 mt-1 rounded-full object-cover";
                                          getDefaultNftImageOnError(e);
                                        }}
                                      />

                                      <div className="space-y-1" >
                                        <h3 className="text-sm font-semibold" >{currency.name}</h3>
                                        <p className="text-xs text-su_secondary" >{currency.symbol}</p>
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                );
                              })}
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ScrollBar orientation="vertical" className="bg-transparent" />
                </ScrollArea>
              </div>

            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog >
  );
};

export default CurrencyTokenSelectDialog;