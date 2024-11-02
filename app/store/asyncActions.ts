import {
    getClientsAndRelations,
    getUserTasks,
    modifyTask,
} from '@/services/useTasks'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type RootState } from '.'
import { ClientBasic, Task } from '@/lib/types'

export const modifyTasksAsync = createAsyncThunk<
    Task,
    Task,
    { state: RootState }
>('tasks/modifyTasks', async (task, thunkAPI) => {
    const state = thunkAPI.getState()
    const updatedTask = await modifyTask(task, state.auth.jid)

    return updatedTask
})

export const getTasksAsync = createAsyncThunk<
    Task[],
    string,
    { state: RootState }
>('tasks/getTasks', async (clientId, thunkAPI) => {
    const state = thunkAPI.getState()
    const response = await getUserTasks(clientId, state.auth.jid)
    const tasks: Task[] = []

    for (const item of response) {
        const newTask: Task = {
            client_code: item.CODI_CLIENT,
            client_name: '',
            task_id: item.task_id,
            task_num: item.task_num,
            apparel_name: '',
            type: '',
            description: item.description,
            priority: '',
            solicited_date: item.solicited_date,
            specialty: '',
            state: '',
            attachment: item.attachment || null,
            IsHistoric: item.IsHistoric ?? false,
            total: item.total ?? 0,
        }

        const apparel = state.tasks.apparels.find(
            (apparel) => apparel.IDFAPARELLS === item.apparel_id
        )

        newTask.apparel_name = apparel
            ? apparel.MARCA + ' - ' + apparel.MODEL + ' - ' + apparel.REFERENCIA
            : item.apparel_id.toString()

        const priority = state.tasks.priorities.find(
            (priority) => priority.CODI_TIPUS === item.priority_id
        )
        newTask.priority = priority ? priority.DESCRIPCIO : item.priority_id

        const type = state.tasks.types.find(
            (type) => type.CODI_TIPUS === item.type_id
        )
        newTask.type = type ? type.DESCRIPCIO : item.type_id

        const specialty = state.tasks.specialties.find(
            (specialty) => specialty.CODI_TIPUS === item.specialty_id
        )
        newTask.specialty = specialty ? specialty.DESCRIPCIO : item.specialty_id

        const taskState = state.tasks.states.find(
            (state) => state.FULL_TREBALL_ESTATID === item.state_id
        )
        newTask.state = taskState
            ? taskState.DESCRIPCIO
            : item.state_id.toString()

        newTask.client_name =
            state.clients.clients.find(
                (client) => client.CODI_CLIENT === item.CODI_CLIENT
            )?.NOM ?? ''

        newTask.client_code = item.CODI_CLIENT

        tasks.push(newTask)
    }
    return tasks
})

export const getClientsAsync = createAsyncThunk<
    ClientBasic[],
    string,
    { state: RootState }
>('clients/getClients', async (client_id, thunkAPI) => {
    const state = thunkAPI.getState()
    return await getClientsAndRelations(state.auth.jid, client_id)
})
