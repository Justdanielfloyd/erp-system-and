'use client'

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { useAppSelector } from '@/app/store'
import { selectClients } from '@/app/store/clientsSlice'
import { selectApparels } from '@/app/store/tasksSlice'
import { DataTableFacetedFilter } from '@/components/ui/data-table/data-table-faceted-filter'
import { DataTablePagination } from '@/components/ui/data-table/data-table-pagination'
import { DataTableViewOptions } from '@/components/ui/data-table/data-table-view-options'
import { Apparel, Task } from '@/lib/types'
import { Cross2Icon, DownloadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { useEffect, useRef } from 'react'
import { downloadExcel, DownloadTableExcel } from 'react-export-table-to-excel'

interface DataTableProps<TData, TValue> {
    data: Task[]
    columns: ColumnDef<Task, TValue>[]
}

export function DataTable<TData, TValue>({
    data,
    columns,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: 'id', desc: true },
    ])
    const aparells = useAppSelector(selectApparels)
    const clients = useAppSelector(selectClients)

    const [totalCoste, setTotalCoste] = React.useState<number>(0)
    const [filteredAparells, setFilteredAparells] = React.useState<Apparel[]>(
        []
    )
    const tableRef = useRef(null)

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        columnResizeMode: 'onChange',
        groupedColumnMode: false,
    })

    const isFiltered = table.getState().columnFilters.length > 0

    useEffect(() => {
        setTotalCoste(
            table.getFilteredRowModel().rows.reduce((sum, row) => {
                return sum + (row.original.total ?? 0)
            }, 0)
        )
    }, [isFiltered])

    useEffect(() => {
        if (!isFiltered) return
        const filterClient = table
            .getState()
            .columnFilters.filter(
                (columnFilter) => columnFilter.id === 'client'
            )

        const valuesArray = filterClient[0].value as string[]
        const filteredAparellsProv = aparells.filter((aparell) =>
            valuesArray.includes(aparell.CODI_CLIENT)
        )
        setFilteredAparells(filteredAparellsProv)
    }, [table.getState().columnFilters])

    const handleDownloadExcel = () => {
        const headers = [
            'Núm. full treball',
            'Descripció',
            'Data sol·licitud',
            'Client',
            'Aparell',
            'Cost',
        ]

        const formattedBody = data.map((task) => {
            return {
                task_num: task.task_num,
                description: task.description,
                solicited_date: task.solicited_date,
                client: task.client_name,
                aparell: task.apparel_name,
                total: (task.total ?? 0).toLocaleString('de-DE'),
            }
        })

        formattedBody.push({
            task_num: '',
            description: '',
            solicited_date: '',
            client: '',
            aparell: 'TOTAL',
            total: totalCoste.toLocaleString('de-DE'),
        })

        downloadExcel({
            fileName: 'despeses per aparell ' + Date.now(),
            sheet: 'react-export-table-to-excel',
            tablePayload: {
                header: headers,
                body: formattedBody,
            },
        })
    }

    return (
        <div className="flex flex-col gap-1 pb-4 w-full">
            <div className="flex w-full bg-headers p-2 justify-between">
                <div className="flex items-center justify-start">
                    <div
                        className="flex items-center lg:w-11/12 mr-2"
                        key="client"
                    >
                        {table.getColumn('client') && (
                            <DataTableFacetedFilter
                                column={table.getColumn('client')}
                                title="Client"
                                options={clients.clients.map((client) => ({
                                    label: client.NOM,
                                    value: client.CODI_CLIENT,
                                }))}
                            />
                        )}
                    </div>
                    <div
                        className={`flex items-center lg:w-11/12 ${
                            filteredAparells.length === 0
                                ? 'pointer-events-none opacity-50'
                                : ''
                        }`}
                        key="aparell"
                    >
                        {table.getColumn('aparell') && (
                            <DataTableFacetedFilter
                                column={table.getColumn('aparell')}
                                title="Aparell"
                                options={filteredAparells.map((aparell) => ({
                                    label:
                                        aparell.MARCA +
                                        ' - ' +
                                        aparell.MODEL +
                                        ' - ' +
                                        aparell.REFERENCIA,
                                    value:
                                        aparell.MARCA +
                                        ' - ' +
                                        aparell.MODEL +
                                        ' - ' +
                                        aparell.REFERENCIA,
                                }))}
                            />
                        )}
                    </div>
                </div>

                <div className="flex items-center lg:justify-end mr-2">
                    {isFiltered && (
                        <Button
                            variant="outline"
                            onClick={() => table.resetColumnFilters()}
                            className="h-8 px-2 mr-2 lg:px-3 bg-red-600 text-white hover:bg-red-600/50 hover:text-black"
                        >
                            Treure filtres
                            <Cross2Icon className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        onClick={handleDownloadExcel}
                        variant={'outline'}
                        className="h-8 px-2 lg:px-3 mr-2 bg-primary text-white hover:bg-primary/50 hover:text-black"
                    >
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Exportar a excel
                    </Button>

                    <DataTableViewOptions table={table} />
                </div>
            </div>

            <table className="w-full" ref={tableRef}>
                <TableHeader className="w-full">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                            key={headerGroup.id}
                            className="grid grid-cols-[90px_450px_200px_300px_360px_180px] flex w-full transition-colors text-[#A9B5BD] hover:bg-hoverGrill hover:text-actions data-[state=selected]:bg-hoverGrill data-[state=selected]:text-actions odd:bg-secondaryBackground"
                        >
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                )
                            })}
                        </tr>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className="grid grid-cols-[90px_450px_200px_300px_360px_180px] transition-colors text-[#A9B5BD] hover:bg-hoverGrill hover:text-actions data-[state=selected]:bg-hoverGrill data-[state=selected]:text-actions odd:bg-secondaryBackground"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                    <TableRow className="font-bold flex justify-end">
                        <TableCell
                            colSpan={columns.length - 1}
                            style={{ fontWeight: 'bold' }}
                        >
                            Total
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>
                            {totalCoste.toFixed(2)} €
                        </TableCell>
                    </TableRow>
                </TableBody>
            </table>
            <DataTablePagination table={table} />
        </div>
    )
}
