import { Form, FormControl, FormField, FormItem, FormLabel, } from "@/components/ui/form";
import { SUI_CurrencyChainItem } from "@/types/global.types";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn, getDefaultNftImageOnError } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { IAddedAmount } from "@/types/swap-market-store.types";
import { Schema_AmountConversionForm } from "@/schema";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CurrencyTokenSelectDialog from "./CurrencyTokenSelectDialog";
import { useWalletBalance } from "thirdweb/react";
import { currentChain, thirdWebClient } from "@/lib/thirdWebClient";
import LoadingIcon from "../shared/LoadingIcon";

interface IProp {
  availableCurrencies: SUI_CurrencyChainItem[];
  addedAmount: IAddedAmount | undefined;
  setAddedAmount: (selectedAmount: string, selectedCoin: string) => void;
  className?: string;
  walletForTotalBalance: string;
}


const RoomSelectCryptoSectionSide = ({ availableCurrencies, addedAmount, setAddedAmount, className, walletForTotalBalance }: IProp) => {

  const [openTokenSelectDialog, setOpenTokenSelectDialog] = useState(false);

  // Form Handling
  const form = useForm<z.infer<typeof Schema_AmountConversionForm>>({
    resolver: zodResolver(Schema_AmountConversionForm),
    defaultValues: {
      amount: (addedAmount && addedAmount.amount) ? String(addedAmount.amount) : '',
      chain: JSON.stringify(availableCurrencies[0])
    },
  });

  const { errors } = form.formState;

  const handleFormSubmit = (values: z.infer<typeof Schema_AmountConversionForm>) => {
    const { chain, amount } = values;

    if (chain) {
      setAddedAmount(amount ? amount : '', chain);
      form.reset();
    }
  };

  const getSelectedChain = () => {
    const selectedChain = form.getValues("chain");
    const chain: SUI_CurrencyChainItem = JSON.parse(selectedChain);

    return chain || availableCurrencies[0];
  };

  const handleSetSelectedCurrency = (selectedCurrencyValue: string) => {
    form.setValue('chain', selectedCurrencyValue);
  };

  // useEffect(() => {
  //   const handleSetAddedAmount = async () => {
  //     const isValidForm = await form.trigger();
  //     const chainId = form.watch('chain');
  //     const amount = form.watch('amount');

  //     if (chainId && isValidForm) {
  //       setAddedAmount(amount ? amount : '', chainId);
  //     }
  //   };

  //   handleSetAddedAmount();

  // }, [form.watch('chain'), form.watch('amount')]);

  useEffect(() => {
    if (!(addedAmount?.amount)) {
      form.setValue('amount', '');
    }

  }, [addedAmount?.amount]);

  const { data, isFetching, isLoading, isPending } = useWalletBalance({
    address: walletForTotalBalance,
    chain: currentChain,
    client: thirdWebClient
  });

  return (
    <aside className={cn(
      "space-y-4",
      className
    )}
    >
      <h2>Select Crypto Assets</h2>

      <div className="w-full bg-su_secondary_bg rounded-md py-4 px-3 space-y-1" >

        <Form {...form} >
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="w-full flex items-center gap-2 lg:gap-4">
            <div className={cn(
              "w-full relative flex items-center gap-4 py-2 px-3 rounded-md bg-su_enable_bg ring-offset-su_active_bg focus-within:ring-1 focus-within:ring-su_active_bg focus-within:ring-offset-1",
            )}
            >
              <label
                htmlFor="amount"
                className="w-full flex gap-2 items-center cursor-pointer"
              >

                <svg className="w-4" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.9294 5.71425C11.9294 8.87042 9.37083 11.429 6.21469 11.429C3.05856 11.429 0.5 8.87042 0.5 5.71425C0.5 2.55809 3.05856 -0.000488281 6.21469 -0.000488281C9.37083 -0.000488281 11.9294 2.55809 11.9294 5.71425ZM8.99618 11.9817C8.12045 12.3703 7.17301 12.5711 6.21493 12.5711C5.98634 12.5711 5.75775 12.5597 5.53259 12.5379C5.90083 13.3962 6.47376 14.1512 7.20127 14.7368C7.92877 15.3224 8.78869 15.7208 9.70581 15.8972C10.6229 16.0736 11.5693 16.0226 12.4621 15.7486C13.3549 15.4747 14.167 14.9861 14.8274 14.3256C15.4877 13.6652 15.9762 12.853 16.25 11.9601C16.5238 11.0673 16.5747 10.1209 16.3982 9.2038C16.2216 8.28671 15.8231 7.42684 15.2374 6.69942C14.6516 5.97199 13.8966 5.39917 13.0383 5.03106C13.1336 5.98439 13.0281 6.94712 12.7286 7.85719C12.4291 8.76726 11.9422 9.60448 11.2994 10.3149C10.6565 11.0252 9.87191 11.593 8.99618 11.9817Z" fill="#868691" />
                </svg>

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="w-full relative" >
                      <FormControl>
                        <Input
                          id={field.name}
                          type="number"
                          className="mb-4 text-sm ring-offset-0 focus-within:ring-0 focus-within:ring-transparent focus-within:ring-offset-0"
                          placeholder="Enter amount"
                          {...field}
                        />
                      </FormControl>

                      <FormLabel
                        htmlFor={field.name}
                        className="absolute top-4 cursor-pointer text-2xs"
                      >
                        $ {(Number(getSelectedChain().price) * Number(field.value)).toFixed(2)}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </label>

              <button
                onClick={() => setOpenTokenSelectDialog(true)}
                className="min-w-max rounded-full flex items-center gap-1.5 hover:scale-105 hover:bg-su_enable_bg p-0.5 transition duration-150 ease-in-out "
              >
                <span className="flex items-center gap-2 text-sm" >
                  <img
                    src={getSelectedChain().iconUrl}
                    alt=""
                    className="w-4 h-4"
                    loading="lazy"
                    onError={(e: any) => {
                      e.currentTarget.className = "w-4 h-4 rounded-full object-cover";
                      getDefaultNftImageOnError(e);
                    }}
                  />

                  {getSelectedChain().symbol}
                </span>

                <ChevronDown className={`h-4 w-4 ${openTokenSelectDialog ? "rotate-180 animate-in" : "rotate-0 animate-in"}`} />
              </button>
            </div>

            <Button variant={'outline'} type="submit" >Add</Button>
          </form>
        </Form>

        <p className="text-xs flex items-center justify-between">

          {(isLoading || isFetching || isPending) &&
            <><LoadingIcon /> loading balance...</>
          }

          {data &&
            <>{Number(data?.displayValue).toFixed(8)} {data.symbol} is available.</>
          }

          {errors.amount?.message &&
            <span className="text-su_negative" >{errors.amount.message}</span>
          }
        </p>
      </div>

      {/* Token select dialog */}
      <CurrencyTokenSelectDialog
        open={openTokenSelectDialog}
        setOpen={setOpenTokenSelectDialog}
        handleSetSelectedCurrency={handleSetSelectedCurrency}
      />
    </aside>
  );
};

export default RoomSelectCryptoSectionSide;