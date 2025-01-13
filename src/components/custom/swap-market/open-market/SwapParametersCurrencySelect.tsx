import React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandInput, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { SUI_SwapCurrencyItem } from "@/types/swap-market.types";
import SelectedCurrencyTile from "../../tiles/SelectedCurrencyTile";


interface IProps {
  currencies: SUI_SwapCurrencyItem[];
  value: SUI_SwapCurrencyItem[];
  onChange: (selectedCurrencies: SUI_SwapCurrencyItem[]) => void;
  className?: string;
  maxSelectCurrencies: number;
}

const SwapParametersCurrencySelect: React.FC<IProps> = ({
  currencies,
  value,
  onChange,
  className,
  maxSelectCurrencies
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
            "group active:ring-1 active:ring-su_active_bg  w-full h-auto flex justify-between items-center text-left font-normal bg-su_enable_bg rounded-md text-su_primary text-sm",
            className
          )}
        >
          {value.length > 0 ?
            <p className="" >{value.length} / {maxSelectCurrencies} currencies added</p>
            :
            <span className="text-su_secondary">Select currencies</span>}
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
                {currencies.map((currency, index) => (
                  <CommandItem
                    key={currency.uuid + index}
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

      <div className="w-full grid grid-cols-3 gap-2 pt-2" >
        {
          value.map((currency, index) => (
            <SelectedCurrencyTile
              key={currency.uuid + "-" + index}
              currency={currency}
              CandleCrossClick={() => toggleSelection(currency)}
            />
          ))
        }
      </div>
    </Popover>
  );
};

export default SwapParametersCurrencySelect;
