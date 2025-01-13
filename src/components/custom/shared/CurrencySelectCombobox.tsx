import React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandInput, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { SUI_SwapCurrencyItem } from "@/types/swap-market.types";

interface IProps {
  currencies: SUI_SwapCurrencyItem[];
  value: SUI_SwapCurrencyItem[];
  onChange: (selectedCurrencies: SUI_SwapCurrencyItem[]) => void;
  className?: string;
  placeholder?: string;
  placeholderClassName?: string;
}

const CurrencySelectCombobox: React.FC<IProps> = ({
  currencies,
  value,
  onChange,
  className,
  placeholder = "Select currencies",
  placeholderClassName
}) => {
  const [open, setOpen] = React.useState(false);

  const toggleSelection = (currency: SUI_SwapCurrencyItem) => {
    const isSelected = value.some((c) => c.uuid === currency.uuid);
    if (isSelected) {
      onChange(value.filter((c) => c.uuid !== currency.uuid));
    } else {
      onChange([...value, currency]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "group active:ring-1 active:ring-su_active_bg w-full h-auto flex justify-between items-center text-left font-normal bg-su_enable_bg rounded-md text-su_primary text-sm",
            className
          )}
        >
          {value.length > 0 ?
            <div className="w-full flex gap-2 h-auto flex-wrap" >
              {
                value.map((currency) => (
                  <span
                    key={currency.uuid}
                    className="px-3 py-2 bg-su_enable_bg text-su_primary flex items-center gap-2 rounded-sm"
                  >
                    <img src={currency.iconUrl} alt="" className="w-4 h-4 object-cover" />
                    <span className="text-su_primary font-semibold" >{currency.name}</span>

                    <span
                      className="ml-2 p-2 rounded-full hover:bg-su_active_bg"
                      onClick={() => toggleSelection(currency)}
                    >
                      <svg className="w-2" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.47177 1.58902L8.00207 1.05866L6.94137 -0.00195312L6.41106 0.528399L4.00006 2.9396L1.58906 0.528399L1.05875 -0.00195312L-0.00195312 1.05866L0.528355 1.58902L2.93944 4.0003L0.528356 6.41159L-0.00195312 6.94194L1.05875 8.00256L1.58906 7.47221L4.00006 5.06101L6.41106 7.47221L6.94137 8.00256L8.00207 6.94194L7.47176 6.41159L5.06068 4.0003L7.47177 1.58902Z" fill="#B6B6BD" />
                      </svg>
                    </span>
                  </span>
                ))
              }
            </div>
            :
            <span className={cn(
              "text-su_secondary",
              placeholderClassName
            )}
            >
              {placeholder}
            </span>}
          <ChevronDown className="h-4 w-4 text-white" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="border-none py-1.5">
        <ScrollArea className="h-[288px] px-2 mr-1">
          <Command>
            <CommandInput
              placeholder="Search currencies"
            />

            <CommandList>
              <CommandEmpty>No currencies available</CommandEmpty>

              <CommandGroup>
                {currencies.map((currency) => (
                  <CommandItem
                    key={currency.uuid}
                    value={currency.name}
                    onSelect={() => toggleSelection(currency)}
                  >
                    <span className="w-full flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-su_hover_bg">
                      <Checkbox
                        className=""
                        checked={value.some((c) => c.uuid === currency.uuid)}
                        onChange={() => toggleSelection(currency)}
                      />
                      <span>{currency.name}</span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default CurrencySelectCombobox;
