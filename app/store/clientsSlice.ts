import type { ClientBasic } from '@/lib/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '.'
import { getClientsAsync } from './asyncActions'

export interface IClientState {
    clients: ClientBasic[]
}

const initialState: IClientState = {
    clients: [],
}

export const clientSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        setClients: (state, action: PayloadAction<ClientBasic[]>) => {
            state.clients = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getClientsAsync.fulfilled, (state, action) => {
            state.clients = action.payload
        })
    },
})

// Action creators are generated for each case reducer function
export const { setClients } = clientSlice.actions

export const selectClients = (state: RootState) => state.clients

export const clientReducer = clientSlice.reducer
