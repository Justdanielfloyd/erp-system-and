import { ComponentProps } from 'react'
import Simple from './Simple'
import AparellTable from './AparellTable'

export enum MODAL_TYPES {
    SIMPLE = 'SIMPLE',
    APARELL_TABLE = 'APARELL_TABLE',
}

type Keys = keyof typeof MODAL_TYPES
export type ModalTypes = (typeof MODAL_TYPES)[Keys]

export const MODAL_COMPONENTS = {
    [MODAL_TYPES.SIMPLE]: Simple,
    [MODAL_TYPES.APARELL_TABLE]: AparellTable,
}

type ModalKeys = keyof typeof MODAL_COMPONENTS
export type ModalComponentTypes =
    | ComponentProps<(typeof MODAL_COMPONENTS)[ModalKeys]>
    | {}
