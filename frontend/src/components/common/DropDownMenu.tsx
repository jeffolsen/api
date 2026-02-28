import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import { Button } from "./Button";
import { ButtonColor } from "./helpers/contentStyles";
import clsx, { ClassValue } from "clsx";

export type DropDownItem = {
  id: string;
  label: string;
};

export type DropDownMenuProps = {
  items: DropDownItem[];
  buttonColor?: ButtonColor;
  optionsColor?: ButtonColor;
  selectedOptionColor?: ButtonColor;
  onChange: (item: DropDownItem) => void;
  className?: ClassValue;
};

const DropDownMenu = ({
  items,
  buttonColor = "primary",
  optionsColor = "secondary",
  selectedOptionColor = "neutral",
  onChange,
  className,
}: DropDownMenuProps) => {
  const [selectedItem, setSelectedItem] = useState<DropDownItem>(items[0]);

  return (
    <Listbox
      as="div"
      className={clsx("dropdown-menu", className)}
      value={selectedItem}
      onChange={(item) => {
        setSelectedItem(item);
        onChange(item);
      }}
    >
      <ListboxButton as="div">
        <Button className="w-full" color={buttonColor}>
          {selectedItem?.label}
        </Button>
      </ListboxButton>
      <ListboxOptions className="w-full px-6 md:w-auto md:px-0" anchor="bottom">
        {items.map((item) => (
          <ListboxOption as="div" key={item.id} value={item}>
            <Button
              className="w-full"
              color={item === selectedItem ? selectedOptionColor : optionsColor}
            >
              {item.label}
            </Button>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

export default DropDownMenu;
