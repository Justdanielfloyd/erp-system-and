import {
    Apparel,
    TaskLocation,
    TaskPriority,
    TaskSpecialty,
    TaskState,
    TaskType,
} from '@/lib/types'

import type { Task } from '@/lib/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '.'
import { getTasksAsync, modifyTasksAsync } from './asyncActions'

export interface ITaskState {
    tasks: Task[]
    apparels: Apparel[]
    types: TaskType[]
    priorities: TaskPriority[]
    specialties: TaskSpecialty[]
    states: TaskState[]
    locations: TaskLocation[]
}

const initialState: ITaskState = {
    tasks: [],
    apparels: [],
    types: [],
    priorities: [],
    specialties: [],
    states: [],
    locations: [],
}

export const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload
        },
        setApparels: (state, action: PayloadAction<Apparel[]>) => {
            state.apparels = action.payload
        },
        setTypes: (state, action: PayloadAction<TaskType[]>) => {
            state.types = action.payload
        },
        setPriorities: (state, action: PayloadAction<TaskPriority[]>) => {
            state.priorities = action.payload
        },
        setSpecialties: (state, action: PayloadAction<TaskSpecialty[]>) => {
            state.specialties = action.payload
        },
        setStates: (state, action: PayloadAction<TaskState[]>) => {
            state.states = action.payload
        },
        setLocations: (state, action: PayloadAction<TaskLocation[]>) => {
            state.locations = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getTasksAsync.fulfilled, (state, action) => {
            state.tasks = action.payload
        })
        builder.addCase(modifyTasksAsync.fulfilled, (state, action) => {
            const modifiedTask = action.payload

            const taskIndex = state.tasks.findIndex(
                (t) => t.task_id === modifiedTask.task_id
            )

            if (taskIndex !== -1) {
                state.tasks[taskIndex] = modifiedTask
            }
        })
    },
})

// Action creators are generated for each case reducer function
export const {
    setTasks,
    setApparels,
    setTypes,
    setPriorities,
    setSpecialties,
    setStates,
    setLocations,
} = taskSlice.actions

export const selectTasks = (state: RootState) => state.tasks.tasks
export const selectApparels = (state: RootState) => state.tasks.apparels
export const selectTypes = (state: RootState) => state.tasks.types
export const selectPriorities = (state: RootState) => state.tasks.priorities
export const selectSpecialties = (state: RootState) => state.tasks.specialties
export const selectStates = (state: RootState) => state.tasks.states

export const taskReducer = taskSlice.reducer
