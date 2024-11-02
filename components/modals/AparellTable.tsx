import { DataTable } from '@/app/dashboard/tasks/data-table'
import { useModal } from '@/context/ModalProvider'
import { Apparel } from '@/lib/types'
import { Box, Button, Checkbox, Divider } from '@mantine/core'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa6'
import { DataTableColumnHeader } from '../ui/data-table/data-table-column-header'

interface AparellTableProps {
    handleAction?: (() => void) | (() => Promise<void>)
    aparells: Apparel[]
    setSelectedRow?: React.Dispatch<React.SetStateAction<Apparel>>
}

const AparellTable: React.FC<AparellTableProps> = ({
    handleAction,
    aparells,
    setSelectedRow,
}) => {
    const { closeModal } = useModal()
    const primaryBtnLabel = 'Acceptar'
    const secondaryBtnLabel = 'Cancel·lar'

    const columns: ColumnDef<Apparel>[] = [
        {
            id: 'select',
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Selecciona una fila"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'IDFAPARELLS',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="ID Aparell" />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <span className="font-medium">
                        {row.original.IDFAPARELLS}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'MARCA',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Marca" />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <span className="font-medium">{row.original.MARCA}</span>
                </div>
            ),
        },
        {
            accessorKey: 'MODEL',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Model" />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <span className="font-medium">{row.original.MODEL}</span>
                </div>
            ),
        },
        {
            accessorKey: 'REFERENCIA',
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Referencia" />
            ),
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <span className="font-medium">
                        {row.original.REFERENCIA}
                    </span>
                </div>
            ),
        },
    ]

    const action = async () => {
        if (handleAction) {
            await handleAction()
            closeModal()
        } else {
            closeModal()
        }
    }

    return (
        <Box p="md">
            <DataTable
                data={aparells}
                columns={columns}
                setSelectedRow={setSelectedRow}
            />
            <Divider my="md" style={{ margin: '2rem 0' }} />
            <Box mt="md" display={'flex'} sx={{ justifyContent: 'center' }}>
                {handleAction && (
                    <Button
                        onClick={closeModal}
                        size="small"
                        mr="md"
                        color="gray"
                    >
                        <FaTimes style={{ marginRight: '5px' }} />
                        {secondaryBtnLabel}
                    </Button>
                )}
                <Button onClick={action} autoFocus size="small" color="green">
                    <FaCheck style={{ marginRight: '5px' }} />
                    {primaryBtnLabel}
                </Button>
            </Box>
        </Box>
    )
}

export default AparellTable
