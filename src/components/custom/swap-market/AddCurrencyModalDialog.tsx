import { Button } from "@/components/ui/button";

import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { SUI_CurrencyChainItem } from "@/types/global.types";
import { Schema_AmountConversionForm } from "@/schema";
import { ChevronDown } from "lucide-react";
import CurrencyTokenSelectDialog from "./CurrencyTokenSelectDialog";


interface IProp {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: any;
  availableChains: SUI_CurrencyChainItem[];
  getSelectedChain: () => SUI_CurrencyChainItem;
  handleFormSubmit: (values: z.infer<typeof Schema_AmountConversionForm>) => void,
  handleSetSelectedCurrency: (selectedCurrencyValue: string) => void;
  form: UseFormReturn<{
    amount?: string;
    chain: string;
  }, any, undefined>;
}

const AddCurrencyModalDialog = ({ children, handleFormSubmit, form, availableChains, getSelectedChain, handleSetSelectedCurrency, open, setOpen }: IProp) => {


  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>

      <DialogContent className="w-[400px] p-4" >
        <div className="space-y-3" >
          {/* header */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-xl" >Choose currency type and define amount</h2>

              <DialogClose className="p-1 rounded-xs hover:bg-su_active_bg" >
                <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </DialogClose>
            </div>

            <p className="text-base font-medium text-secondary dark:text-su_secondary">Choose the currency type and enter the amount to incorporate into your swap offer.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">

              <div
                className={cn(
                  "relative flex items-center justify-between py-2 px-3 rounded-md bg-su_enable_bg ring-offset-su_active_bg focus-within:ring-1 focus-within:ring-su_active_bg focus-within:ring-offset-1",
                )}
              >
                <div className="flex gap-2 items-center" >
                  <svg className="w-4" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.9294 5.71425C11.9294 8.87042 9.37083 11.429 6.21469 11.429C3.05856 11.429 0.5 8.87042 0.5 5.71425C0.5 2.55809 3.05856 -0.000488281 6.21469 -0.000488281C9.37083 -0.000488281 11.9294 2.55809 11.9294 5.71425ZM8.99618 11.9817C8.12045 12.3703 7.17301 12.5711 6.21493 12.5711C5.98634 12.5711 5.75775 12.5597 5.53259 12.5379C5.90083 13.3962 6.47376 14.1512 7.20127 14.7368C7.92877 15.3224 8.78869 15.7208 9.70581 15.8972C10.6229 16.0736 11.5693 16.0226 12.4621 15.7486C13.3549 15.4747 14.167 14.9861 14.8274 14.3256C15.4877 13.6652 15.9762 12.853 16.25 11.9601C16.5238 11.0673 16.5747 10.1209 16.3982 9.2038C16.2216 8.28671 15.8231 7.42684 15.2374 6.69942C14.6516 5.97199 13.8966 5.39917 13.0383 5.03106C13.1336 5.98439 13.0281 6.94712 12.7286 7.85719C12.4291 8.76726 11.9422 9.60448 11.2994 10.3149C10.6565 11.0252 9.87191 11.593 8.99618 11.9817Z" fill="#868691" />
                  </svg>
                  <span className="space-y-1">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem className="" >
                          <FormControl>
                            <Input
                              type="number"
                              className="text-sm placeholder:text-white ring-offset-0 focus-within:ring-0 focus-within:ring-transparent focus-within:ring-offset-0"
                              placeholder="Enter amount"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="absolute -bottom-6 left-2" />
                        </FormItem>
                      )}
                    />
                    {!form.watch("amount") && <span className="text-xs text-su_secondary" >$ 0.0</span>}
                  </span>
                </div>

                <button
                  onClick={() => setOpen(true)}
                  className="min-w-[100px] border border-su_disabled rounded-full p-1.5 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 text-sm" >
                    <img
                      src={getSelectedChain().iconUrl}
                      alt=""
                      className="w-4 h-4"
                    />

                    {getSelectedChain().symbol}
                  </span>

                  <ChevronDown className={`h-4 w-4 ${open ? "rotate-180 animate-in" : "rotate-0 animate-in"}`} />
                </button>
              </div>

              <div className="py-2" >
                <Button
                  variant={"default"}
                  className="w-full"
                  type="submit"
                >
                  Apply
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <CurrencyTokenSelectDialog
          open={open}
          setOpen={setOpen}
          handleSetSelectedCurrency={handleSetSelectedCurrency}
        />
      </DialogContent>
    </Dialog >
  );
};

export default AddCurrencyModalDialog;