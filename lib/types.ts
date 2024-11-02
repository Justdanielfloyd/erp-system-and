import { User } from 'next-auth'
import type { Toast, ToastAction } from '@/components/ui/toast'
import { z } from 'zod'
import { taskSchema } from '@/data/zodSchema/task'

//Authentication
export type LoginFn = (email: string, password: string) => Promise<User>

export type RequestBody = {
    Login: string
    Contrasenya: string
}

export type Client = {
    CODI_CLIENT: string
    NOM: string
    ADRECA: string
    ADRECA_COMPL: string
    CODI_PAIS: string
    CODI_POBLACIO: string
    TELEFON: string
    EMAIL_: string
    FAX_: string
    DNIPASS: string
    NOTES: string
    ES_COMPANYIA: boolean
    CODI_BANC: string
    CODI_SUCURSAL: string
    COMPTE: string
    COMPTEIBAN: string
    TELEF2: string
    CODI_POSTAL: string
    NRT: string
    CODI_FP: string
    CODI_ABA: string
    CODI_BANC_REMESA: string
    ESTAT: string
    DTE_FIXE: number
    APLICAR_TARIFA: string
    DTE_PRONTOPAGO: number
    CODI_BARRES: string
    TiPUS_CLIENT: string
    CONTACTE: string
    CODICONTB: string
    SOCIETAT: string
    TIPUS: string
    CODI_SERIE: string
    CODI_COMPTA: string
    LLIURADOR: string
    VINCULAR_COMUNITAT: boolean
    TARIFESID: number
    CODI_VENEDOR: string
    COMISSIO_VENEDOR: number
    CODI_PARROQUIA: string
    TIPUS_FACTURACIO: string
    DTE_LINIA_FIXE: number
    CLIENT_DEUTOR: boolean
    CLI_AMB_INCIDENCIES: boolean
    REPRESENTANT: string
    REPRESENTANT_DOCUMENT: string
    REPRESENTANT_NACIONALITAT: string
    PAIS_VENDA: string
    CODI_FISIO: string
    CODI_METGE: string
    CODI_MONEDA: string
    COMPTE_VENDES: string
    CODI_IMPOST: string
    SEPA: boolean
    TARIFES_DESCOMPTEID: number
    USUARI_ULTIMAMOD: string
    ORIGEN_MODIFICACIO: string
    DATA_ULTIMA_MOD: Date
}

export type ClientBasic = {
    CODI_CLIENT: string
    NOM: string
    CODI_CADENA?: string
}

//Tasks
export type Attachment = {
    dataURL: string
    attachmentName: string
    type: string
}

export type Task = z.infer<typeof taskSchema> & {
    attachment?: Attachment[] | null
}

export type UnformattedTask = {
    task_id: number
    task_num: string
    apparel_id: number
    type_id: string
    description: string
    priority_id: string
    solicited_date: string
    specialty_id: string
    state_id: number
    attachment?: Attachment[] | null
    CODI_CLIENT: string
    IsHistoric: boolean
    total?: number
}

export type FormData = {
    location?: string
    client: string
    apparel?: string
    type?: string
    priority?: string
    date: Date
    specialty?: string
    client_code: string
    attachment?: Attachment[]
    description: string
}

export type FormComboValues = {
    apparels?: string
    ordreTreballTypes?: string
    ordreTreballPriorities?: string
    ordreTreballSpecialties?: string
    ordreTreballStates?: string
    ordreTreballUbicacions?: string
}

export type Apparel = {
    IDFAPARELLS: number
    CODI_CLIENT: string
    APARELL: string
    MARCA: string
    MODEL: string
    SERVICE: string
    DATA_COMPRA: string
    FABRICANT: string
    OBSERVACIONS: string
    FOTO_APARELL: string
    FOTO_TECNICA: string
    CODI_UBICACIO: string
    CODI_TIPUS: string
    REFERENCIA: string
}

export type ApparelType = {
    FAPARELLS_TIPUSID: number
    CODI_TIPUS: string
    DESCRIPCIO: string
}

export type TaskType = {
    FULL_TREBALL_TIPUSID: number
    CODI_TIPUS: string
    DESCRIPCIO: string
}

export type TaskPriority = {
    FULL_TREBALL_PRIORITATID: number
    CODI_TIPUS: string
    DESCRIPCIO: string
}

export type TaskSpecialty = {
    FULL_TREBALL_ESPECIALITATID: number
    CODI_TIPUS: string
    DESCRIPCIO: string
}

export type TaskState = {
    FULL_TREBALL_ESTATID: number
    CODI_ESTAT: string
    DESCRIPCIO: string
    PENDENT: string
}

export type TaskLocation = {
    FUBICACIO_CLIENTSID: number
    CODI_UBICACIO: string
    DESCRIPCIO: string
    CODI_CLIENT: string
}

export type TaskEntities = {
    apparels: Apparel[]
    types: TaskType[]
    priorities: TaskPriority[]
    specialties: TaskSpecialty[]
    states: TaskState[]
    locations: TaskLocation[]
}

//Navbar
export type SideNavItem = {
    title: string
    path: string
    icon?: JSX.Element
    submenu?: boolean
    subMenuItems?: SideNavItem[]
}

export interface MenuItemWithSubMenuProps {
    item: SideNavItem
    toggleOpen: () => void
    handleLoader: () => void
    setNavigate: (navigate: string) => void
}

//UI toaster
const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST',
}

type ActionType = typeof actionTypes

type GenericAction<
    Toast,
    ToastKey extends keyof Toast,
    ActionKey extends keyof ActionType,
> = {
    toast?: Toast
    toastId?: ActionKey extends 'REMOVE_TOAST' | 'DISMISS_TOAST'
        ? string
        : ToastKey
    type: ActionKey
}

export type Action =
    | GenericAction<ToasterToast, 'id', 'ADD_TOAST'>
    | GenericAction<Partial<ToasterToast>, 'id', 'UPDATE_TOAST'>
    | GenericAction<ToasterToast, 'id', 'DISMISS_TOAST'>
    | GenericAction<ToasterToast, 'id', 'REMOVE_TOAST'>

export type State = {
    toasts: (ToasterToast | undefined)[] | undefined
}

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

export type ToastActionElement = React.ReactElement<typeof ToastAction>

export type ToasterToast = ToastProps & {
    id?: string | undefined
    title?: React.ReactNode
    description?: React.ReactNode
    action?: ToastActionElement
}

export type FieldSearchType = {
    label: string
    column: string
}

export type ComboSearchType = {
    title: string
    column: string
    values: string[]
}

export type DataTableToolbarFilters = {
    fieldSearchType: FieldSearchType[]
    comboSearchType: ComboSearchType[]
}

export type Toast = Omit<ToasterToast, 'id'>
