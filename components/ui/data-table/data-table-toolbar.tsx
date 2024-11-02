'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/ui/data-table/data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableToolbarFilters } from '@/lib/types'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    dataTableToolbarFilters?: DataTableToolbarFilters
}

export function DataTableToolbar<TData>({
    table,
    dataTableToolbarFilters,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex max-lg:flex-col gap-3 lg:gap-8 w-full bg-headers p-2">
            {dataTableToolbarFilters?.fieldSearchType.map((field) => (
                <div
                    className="flex items-center lg:w-11/12"
                    key={field.column}
                >
                    <span className="text-p mr-2">{field.label}</span>
                    <Input
                        key={field.column}
                        value={
                            (table
                                .getColumn(field.column)
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn(field.column)
                                ?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-3/4 max-lg:w-full"
                    />
                </div>
            ))}

            {dataTableToolbarFilters?.comboSearchType.map((combo) => (
                <div
                    className="flex items-center lg:w-11/12"
                    key={combo.column}
                >
                    {table.getColumn(combo.column) && (
                        <DataTableFacetedFilter
                            column={table.getColumn(combo.column)}
                            title={combo.title}
                            options={combo.values.map((value) => ({
                                label: value,
                                value: value,
                            }))}
                        />
                    )}
                </div>
            ))}
            <div className="flex items-center lg:justify-end">
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
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}
