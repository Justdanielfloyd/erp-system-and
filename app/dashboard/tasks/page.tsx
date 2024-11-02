'use client'

import { useAppDispatch, useAppSelector } from '@/app/store'
import { getTasksAsync } from '@/app/store/asyncActions'
import { selectClients } from '@/app/store/clientsSlice'
import {
    selectPriorities,
    selectStates,
    selectTasks,
} from '@/app/store/tasksSlice'
import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { columns } from './columns'
import { DataTable } from './data-table'

export default function TaskPage() {
    const { data: session } = useSession()
    const [isClient, setIsClient] = useState(false)
    const dispatch = useAppDispatch()
    const clients = useAppSelector(selectClients)
    const tasks = useAppSelector(selectTasks)
    const states = useAppSelector(selectStates)
    const priorities = useAppSelector(selectPriorities)

    const filters = {
        fieldSearchType: [
            { column: 'id', label: 'Núm.' },
            { column: 'description', label: 'Descripció' },
            { column: 'aparell', label: 'Aparell' },
        ],
        comboSearchType: [
            {
                title: 'Client',
                column: 'client',
                values: clients.clients.map((c) => c.NOM),
            },
            {
                title: 'Prioritat',
                column: 'priority',
                values: priorities.map((p) => p.DESCRIPCIO),
            },
            {
                title: 'Estat',
                column: 'state',
                values: states.map((s) => s.DESCRIPCIO),
            },
        ],
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!session) return
            await dispatch(getTasksAsync(session?.user?.Codi_Client))
            setIsClient(true)
        }
        fetchData()
    }, [session, dispatch])

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col space-y-2">
                <h2 className="text-h1 text-primary font-bold tracking-tight">
                    Fulls de treball
                </h2>
                <p className="text-muted-foreground">
                    Llista de tots els fulls de treball generats
                </p>
            </div>
            <Separator />
            {isClient && (
                <DataTable
                    data={tasks}
                    columns={columns}
                    dataTableToolbarFilters={filters}
                />
            )}
        </div>
    )
}
