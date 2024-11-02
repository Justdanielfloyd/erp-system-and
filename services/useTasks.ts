'use server'
import {
    Task,
    TaskType,
    TaskPriority,
    TaskSpecialty,
    TaskEntities,
    TaskState,
    UnformattedTask,
    TaskLocation,
    Apparel,
    FormComboValues,
    ClientBasic,
    FormData,
} from '@/lib/types'
import { parseArray } from '@/lib/utils'
import { NextResponse } from 'next/server'
import axios from 'axios'

export const getUserTasks = async (
    client_id: string,
    token: string
): Promise<UnformattedTask[]> => {
    try {
        const response = await axios.get(
            `${process.env.API_SERVER_LOCAL}${process.env.API_PATH}/SincronitzarFullsTreballClientRecursiu/${client_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                },
            }
        )
        return response.data
    } catch (error) {
        console.error('Error in getUserTasks')
        console.error(error)
        return []
    }
}

export const createTask = async (
    { date, ...body }: FormData,
    token?: string
): Promise<NextResponse> => {
    const year: number = date.getFullYear()
    const month: string = ('0' + (date.getMonth() + 1)).slice(-2)
    const day: string = ('0' + date.getDate()).slice(-2)
    const dateString = [year, month, day].join('')

    const url = `${process.env.API_SERVER_LOCAL}${process.env.API_PATH}/CrearFullTreball`
    const response = await axios.post(
        url,
        { date: dateString, ...body },
        {
            headers: {
                'Content-Type': 'application/json',
                authorization: token ?? '',
            },
        }
    )
    return response.data
}

export const modifyTask = async (
    updatedTask: Task,
    token: string
): Promise<Task> => {
    try {
        const { task_id, description, attachment } = updatedTask

        const requestBody = {
            description,
            attachment,
        }

        const request = await fetch(
            `${process.env.API_SERVER_LOCAL}${process.env.API_PATH}/ModificarFullTreball/${task_id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                },
                body: JSON.stringify(requestBody),
            }
        )
        if (!request.ok)
            throw new Error(
                `Failed to modify task: ${request.status} ${request.statusText}`
            )
        return await request.json()
    } catch (error) {
        throw new Error(`Failed to modify task: ${error}`)
    }
}

export const getClientsAndRelations = async (
    token: string,
    client_id: string
): Promise<ClientBasic[]> => {
    const url = `${process.env.API_SERVER_LOCAL}${process.env.API_PATH}/SincronitzarClientesByCodiCadena/${client_id}`
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: token ?? '',
                'Content-Type': 'application/json',
            },
        })
        return response.data
    } catch (error: any) {
        console.error('Error in getClientsAndRelations:', url)
        console.error(error.message)
        console.error(error)
        throw new Error('Error in getClientsAndRelations: ' + error.message)
    }
}

export const getTasksEntities = async (
    token: string,
    client_id: string
): Promise<TaskEntities> => {
    try {
        const response = await axios.get(
            `${process.env.API_SERVER_LOCAL}${process.env.API_PATH}/RecuperarLineasComboOrdreTreballRecursiu/${client_id}`,
            {
                headers: {
                    Authorization: token ?? '',
                    'Content-Type': 'application/json',
                },
            }
        )
        if (response.status === 200) {
            const formComboValues: FormComboValues = await response.data
            return parseTaskEntities(formComboValues)
        } else throw new Error('New Tasks form data not found.')
    } catch (error) {
        console.error(error)
        throw new Error('New Tasks form data not found.')
    }
}

const parseTaskEntities = (formComboValues: FormComboValues): TaskEntities => {
    return {
        apparels: parseArray<Apparel>(formComboValues.apparels),
        types: parseArray<TaskType>(formComboValues.ordreTreballTypes),
        priorities: parseArray<TaskPriority>(
            formComboValues.ordreTreballPriorities
        ),
        specialties: parseArray<TaskSpecialty>(
            formComboValues.ordreTreballSpecialties
        ),
        states: parseArray<TaskState>(formComboValues.ordreTreballStates),
        locations: parseArray<TaskLocation>(
            formComboValues.ordreTreballUbicacions
        ),
    }
}
