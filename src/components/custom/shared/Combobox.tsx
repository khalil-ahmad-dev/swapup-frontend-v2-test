import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SelectableItem {
  value: string;
  label: string;
}
interface IComboboxProps {
  items: SelectableItem[];
  className?: string;
  value: string | undefined;
  onChange: (...event: any[]) => void;
  title?: string;
}

const Combobox = ({ items, className, value, onChange, title = "item" }: IComboboxProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "group w-full flex justify-between items-center text-left font-normal bg-su_enable_bg rounded-sm text-su_primary text-sm",
            className
          )}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : <span className="text-su_secondary" >Select {title}</span>}
          <ChevronDown className="h-4 w-4 text-white" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="border-none py-1.5">
        <ScrollArea className="h-[288px] px-2 mr-1">
          <Command>
            <CommandInput
              placeholder={`Search by ${title} name`}
            />

            <CommandList>
              <CommandEmpty>No {title} found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue: any) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="capitalize"
                  >
                    {item.label}

                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
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

export default Combobox;