'use client'

import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
// import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table/data-table-row-actions'
import { stateIcons } from '@/data/tasks/data'
import { Task } from '@/lib/types'
import { parseDate } from '@/lib/utils'

export const columns: ColumnDef<Task>[] = [
    {
        id: 'id',
        accessorKey: 'id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Núm." />
        ),
        cell: ({ row }) => (
            <div>
                <span className="truncate font-medium">
                    {row.original.task_num}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Descripció" />
        ),
        cell: ({ row }) => (
            <div>
                {row.original.type && (
                    <Badge variant="outline" className="mr-2">
                        {row.original.type.toLowerCase()}
                    </Badge>
                )}

                <span className="truncate font-medium">
                    {row.original.description.slice(0, 1).toUpperCase() +
                        row.original.description.slice(1).toLowerCase()}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'solicited_date',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Data de sol·licitud"
            />
        ),
        cell: ({ row }) => {
            return (
                <div>
                    <span>
                        {parseDate(
                            row.getValue('solicited_date')
                        ).toLocaleDateString('en-GB')}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: 'client',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Client" />
        ),
        cell: ({ row }) => (
            <div>
                <span>{row.original.client_name}</span>
            </div>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.original.client_name)
        },
    },
    {
        accessorKey: 'aparell',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Aparell" />
        ),
        cell: ({ row }) => (
            <div>
                <span>
                    {row.original.apparel_name === '0'
                        ? ''
                        : row.original.apparel_name}
                </span>
            </div>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.original.apparel_name)
        },
    },
    {
        accessorKey: 'priority',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Prioritat" />
        ),
        cell: ({ row }) => (
            <div>
                <span>
                    {row.original.priority.slice(0, 1) +
                        row.original.priority.slice(1).toLowerCase()}
                </span>
            </div>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    {
        accessorKey: 'specialty',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Especialitat" />
        ),
        cell: ({ row }) => (
            <div>
                <span className="truncate">
                    {row.original.specialty.slice(0, 1) +
                        row.original.specialty.slice(1).toLowerCase()}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'state',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Estat" />
        ),
        cell: ({ row }) => {
            const state = stateIcons.find(
                (state) => state.value === row.original.state
            )
            if (!state) return
            return (
                <div className="flex items-center">
                    {state.icon && (
                        <state.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{state.label}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return row.original.IsHistoric ? null : (
                <DataTableRowActions row={row} />
            )
        },
    },
]
