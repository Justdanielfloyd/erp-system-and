import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux'
import { persistReducer } from 'redux-persist'
import storage from './customStorage'
import { authReducer } from './authSlice'
import { taskReducer } from './tasksSlice'
import { clientReducer } from './clientsSlice'

const authPersistConfig = {
    key: 'auth',
    storage: storage,
    whitelist: ['isAuth', 'jid'],
}

const taskPersistConfig = {
    key: 'tasks',
    storage: storage,
    whitelist: [
        'tasks',
        'apparelTypes',
        'types',
        'priorities',
        'specialties',
        'states',
    ],
}

const clientPersistConfig = {
    key: 'clients',
    storage: storage,
    whitelist: ['clients'],
}

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    clients: persistReducer(clientPersistConfig, clientReducer),
    tasks: persistReducer(taskPersistConfig, taskReducer),
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
