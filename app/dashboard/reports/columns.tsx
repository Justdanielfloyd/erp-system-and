import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header'
import { Task } from '@/lib/types'
import { parseDate } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'

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
            return value.includes(row.original.client_code)
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
        accessorKey: 'total',
        header: ({ column }) => (
            <div className="w-full text-right px-1">
                <DataTableColumnHeader
                    column={column}
                    title="Cost"
                    className="w-full flex justify-end px-1"
                />
            </div>
        ),
        cell: ({ row }) => {
            return (
                <div className="w-full text-right px-1">
                    <span className="!text-right">
                        {row.original.total === 0
                            ? ''
                            : row.original.total?.toFixed(2) + ' €'}
                    </span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
]
