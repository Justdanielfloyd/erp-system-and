"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { type Client, clients } from "@/data/clients";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface ClientSwitcherProps extends PopoverTriggerProps {
  onModification: (client_id: number) => void;
}

export default function ClientSwitcher({
  className,
  onModification,
}: ClientSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const clientParams = Number(searchParams.get("client"));

  const matchingClient = clients.find(
    (client) => client.client_id === clientParams
  );

  const [open, setOpen] = React.useState(false);
  const [showNewClientDialog, setShowNewClientDialog] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState<
    Client | undefined
  >(matchingClient || undefined);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  return (
    <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Seleccionar un cliente"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedClient?.client_id}.png`}
                alt={selectedClient?.first_name}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedClient?.first_name + " " + selectedClient?.last_name}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Buscar cliente..." />
              <CommandEmpty>No client found.</CommandEmpty>
              <CommandGroup heading="Clientes">
                {clients.map((client) => (
                  <CommandItem
                    key={client.client_id}
                    onSelect={() => {
                      onModification(client.client_id);
                      setSelectedClient(client);
                      setOpen(false);
                      router.push(
                        pathname +
                          "?" +
                          createQueryString("client", `${client.client_id}`)
                      );
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${client.client_id}.png`}
                        alt={client.first_name + client.last_name}
                        className="grayscale"
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {client.first_name + " " + client.last_name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedClient?.client_id === client.client_id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewClientDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Crear cliente
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create client</DialogTitle>
          <DialogDescription>
            Add a new client to manage products and much more.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowNewClientDialog(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
