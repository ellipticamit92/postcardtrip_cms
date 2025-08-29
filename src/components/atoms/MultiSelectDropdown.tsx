import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

type MultiSelectDropdownProps = {
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
};

function MultiSelectDropdown({
  options,
  value,
  onChange,
}: MultiSelectDropdownProps) {
  return (
    <Command>
      <CommandGroup>
        {options.map((option) => (
          <CommandItem
            key={option.value}
            aria-selected={value.includes(option.value)}
            onSelect={() => {
              onChange(
                value.includes(option.value)
                  ? value.filter((v) => v !== option.value)
                  : [...value, option.value]
              );
            }}
          >
            {option.label}
            {value.includes(option.value) && <Badge>{option.label}</Badge>}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}

export default MultiSelectDropdown;
