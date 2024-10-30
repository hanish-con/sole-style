import { useEffect, useState } from "react";
import { Check, CheckIcon, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";


export default function MultiselectDropdown({ items, values, onChange }: { 
    items: Array<{ label: string, value: string }>,
    values: string[],
    onChange: (v: string[]) => void,
}) {
    const [selectedItems, setSelectedItems] = useState<string[]>(values);
    const [open, setOpen] = useState(false);

    const toggleItem = (value: string) => {
        setSelectedItems((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };
    
    useEffect(() => {
        onChange(selectedItems);
    }, [selectedItems]);

    const truncateText = (text: string, maxLength = 30) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const displayValue = truncateText(selectedItems
        .map((value) => items.find((item) => item.value === value)?.label)
        .join(", ") || "Select sizes...");

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-64 justify-between"
                        style={{
                            whiteSpace: "normal",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                        }}
                    >
                        {displayValue}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0">
                    <Command>
                        <CommandInput placeholder="Search technologies..." />
                        <CommandList>
                            <CommandGroup>
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.label}
                                        onSelect={() => toggleItem(item.value)}
                                    >
                                        <span className="flex">
                                            {item.label}
                                            {selectedItems.includes(item.value) && (
                                                <CheckIcon
                                                    className={cn(
                                                    "ml-auto h-4 w-4",
                                                    "opacity-100"
                                                    )}
                                                />
                                            )}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
