"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FlightSelectorProps {
  flights: {
    Origin: string;
    Destination: string;
    FlightID: string;
    DepartureTime: string;
    ArrivalTime: string;
  }[];
  getFlightId: (flightId: string) => void;
}

export function FlightSelector(props: FlightSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value : "Select Your Flight"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandEmpty>No flights found.</CommandEmpty>
          <CommandGroup>
            {props.flights.map((flight) => (
              <CommandItem
                key={flight.Origin + "-" + flight.Destination}
                value={flight.Origin + " to " + flight.Destination}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  props.getFlightId(flight.FlightID);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === flight.Origin + " to " + flight.Destination
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {flight.Origin + " to " + flight.Destination}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
