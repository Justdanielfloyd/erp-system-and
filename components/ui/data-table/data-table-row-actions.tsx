'use client'

import { DotsHorizontalIcon, DotsVerticalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { taskSchema } from '@/data/zodSchema/task'
import TaskModifierDialog from '../popups/task-modifier-dialog'
import { useState } from 'react'

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const task = taskSchema.parse(row.original)
    const [isDialogOpen, setDialogOpen] = useState(false)
    return (
        <>
            <TaskModifierDialog
                isOpen={isDialogOpen}
                onClose={() => setDialogOpen(false)}
                task={task}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex p-0 data-[state=open]:bg-muted"
                    >
                        <DotsVerticalIcon />
                        <span className="sr-only">Obrir menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                        Editar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
