'use client'

import { useAppDispatch, useAppSelector } from '@/app/store'
import { getTasksAsync } from '@/app/store/asyncActions'
import { selectTasks } from '@/app/store/tasksSlice'
import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { columns } from './columns'
import { DataTable } from './data-table'

export default function TaskPage() {
    const { data: session } = useSession()
    const [isClient, setIsClient] = useState(false)
    const dispatch = useAppDispatch()
    const tasks = useAppSelector(selectTasks)

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
                    Informe de despeses
                </h2>
                <p className="text-muted-foreground">
                    Llista de totes les despeses
                </p>
            </div>
            <Separator />
            {isClient && <DataTable data={tasks} columns={columns} />}
        </div>
    )
}
