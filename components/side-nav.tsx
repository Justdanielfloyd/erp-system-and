'use client'

import { SIDENAV_ITEMS } from '@/lib/constants'
import { useSession } from 'next-auth/react'

import { MenuItem } from '@/components/index-clientside'
import { useAppDispatch } from '@/app/store'
import {
    setApparels,
    setTypes,
    setPriorities,
    setSpecialties,
    setStates,
    setLocations,
} from '@/app/store/tasksSlice'
import { getClientsAndRelations, getTasksEntities } from '@/services/useTasks'
import { useEffect } from 'react'
import { setClients } from '@/app/store/clientsSlice'

const SideNav = () => {
    const { data: session } = useSession()

    const dispatch = useAppDispatch()

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                try {
                    const response = await getTasksEntities(
                        session.user.Token,
                        session.user.Codi_Client
                    )
                    if (!response) throw new Error("Couldn't get API data.")
                    dispatch(setApparels(response.apparels))
                    dispatch(setTypes(response.types))
                    dispatch(setPriorities(response.priorities))
                    dispatch(setSpecialties(response.specialties))
                    dispatch(setStates(response.states))
                    dispatch(setLocations(response.locations))
                } catch (error) {
                    throw new Error(
                        `Could not parse response entities to current store context. ${error}`
                    )
                }

                if (!session?.user) return
                const clients = await getClientsAndRelations(
                    session?.user.Token,
                    session?.user.Codi_Client
                )
                dispatch(setClients(clients))
            }
        }

        fetchData()
    }, [dispatch, session])
    if (session && session.user) {
        return (
            <div className="hidden md:flex flex-col justify-between md:w-64 px-3 pb-14 bg-background border-r border-muted text-foreground h-screen">
                <div className="hidden md:flex flex-col space-y-2 py-8 my-4">
                    {SIDENAV_ITEMS.map((item, idx) => {
                        return <MenuItem key={idx} item={item} />
                    })}
                </div>
            </div>
        )
    }

    return null
}

export default SideNav
