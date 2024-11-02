'use client'

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import React, { useCallback, useEffect } from 'react'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Apparel } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useFormContext, useWatch } from 'react-hook-form'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from './ui/command'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ApparelSwitcherProps extends PopoverTriggerProps {
    onModification: (id: number) => void
    apparels: Apparel[]
}

const ApparelSwitcher = React.forwardRef(function ApparelSwitcher(
    { className, onModification, apparels }: ApparelSwitcherProps,
    ref: React.Ref<SVGSVGElement>
) {
    const [open, setOpen] = React.useState(false)
    const [showNewApparelDialog, setShowNewApparelDialog] =
        React.useState(false)
    const [filteredApparels, setFilteredApparels] = React.useState<Apparel[]>(
        []
    )
    const [selectedApparel, setSelectedApparel] = React.useState<
        Apparel | undefined
    >(undefined)
    const [searchType, setSearchType] = React.useState<string>('')
    const form = useFormContext()
    const locationId = useWatch({ name: 'location' })

    const handleSelect = useCallback(
        (apparel: Apparel) => {
            onModification(apparel.IDFAPARELLS)
            setSelectedApparel(apparel)
            setOpen(false)
        },
        [onModification]
    )

    useEffect(() => {
        if (form) {
            let newFilteredApparels = apparels.slice()

            if (locationId) {
                newFilteredApparels = apparels.filter(
                    (apparel) => apparel.CODI_UBICACIO === locationId
                )
                if (
                    !newFilteredApparels.some(
                        (apparel) =>
                            apparel.IDFAPARELLS === selectedApparel?.IDFAPARELLS
                    )
                ) {
                    setSelectedApparel(undefined)
                }
            }

            setFilteredApparels(newFilteredApparels)
        }
    }, [locationId, form, apparels, selectedApparel])

    return (
        <Dialog
            open={showNewApparelDialog}
            onOpenChange={setShowNewApparelDialog}
        >
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Seleccionar un apparel"
                        className={cn('justify-between ', className)}
                    >
                        <Avatar className="mr-2 h-5 w-5 ">
                            <AvatarImage
                                src={`https://avatar.vercel.sh/${selectedApparel?.IDFAPARELLS}.png`}
                                alt={selectedApparel?.MODEL}
                            />
                            <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        {selectedApparel?.MODEL}
                        <CaretSortIcon
                            className="ml-auto h-4 w-4 shrink-0 opacity-50"
                            ref={ref}
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[790px] p-0">
                    <Command
                        filter={(value, search) =>
                            filteredApparels.some((apparel) => {
                                if (searchType === 'ref') {
                                    const res =
                                        apparel.REFERENCIA.toString() ===
                                            value &&
                                        apparel.REFERENCIA.toLowerCase().includes(
                                            search.toLowerCase()
                                        )
                                    return res
                                } else if (searchType === 'model') {
                                    const res =
                                        apparel.MODEL.toString().toLowerCase() ===
                                            value &&
                                        apparel.MODEL.toLowerCase().includes(
                                            search.toLowerCase()
                                        )
                                    return res
                                }
                            })
                                ? 1
                                : 0
                        }
                    >
                        <CommandList>
                            <div className="flex justify-between p-2">
                                <RadioGroup
                                    onValueChange={(value) =>
                                        setSearchType(value)
                                    }
                                    defaultValue={searchType || undefined}
                                    className="flex flex-row justify-between p-2"
                                >
                                    <CommandInput placeholder="Buscar apparel.." />
                                    <div className="flex items-center space-x-2 ml-auto">
                                        <RadioGroupItem
                                            value="model"
                                            id="model"
                                        />
                                        <Label htmlFor="model">Per model</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-auto">
                                        <RadioGroupItem value="ref" id="ref" />
                                        <Label htmlFor="ref">
                                            Per referència
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <CommandEmpty>No apparel found.</CommandEmpty>
                            <CommandGroup heading="Apparels">
                                {filteredApparels.map((apparel) => (
                                    <CommandItem
                                        key={apparel.IDFAPARELLS}
                                        value={
                                            searchType === 'model'
                                                ? apparel.MODEL
                                                : apparel.REFERENCIA
                                        }
                                        onSelect={() => handleSelect(apparel)}
                                        className="text-sm"
                                    >
                                        <Avatar className="mr-2 h-5 w-5">
                                            <AvatarImage
                                                src={`https://avatar.vercel.sh/${apparel.IDFAPARELLS}.png`}
                                                alt={apparel.MODEL}
                                                className="grayscale"
                                            />
                                            <AvatarFallback>SC</AvatarFallback>
                                        </Avatar>
                                        {apparel.MODEL}
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto h-4 w-4',
                                                selectedApparel?.IDFAPARELLS ===
                                                    apparel.IDFAPARELLS
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                            ref={ref}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator />
                    </Command>
                </PopoverContent>
            </Popover>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create apparel</DialogTitle>
                    <DialogDescription>
                        Add a new apparel to manage products and much more.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setShowNewApparelDialog(false)}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit">Continuar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})

export default ApparelSwitcher
