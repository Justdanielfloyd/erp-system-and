import {
    ModalTypes,
    ModalComponentTypes,
    MODAL_COMPONENTS,
} from '@/components/modals/modalTypes'
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalProps,
    ModalRoot,
    ModalTitle,
    useMantineTheme,
} from '@mantine/core'
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'

type Store = {
    modals: ModalTypes[]
    modalProps: ModalComponentTypes[]
    globalModalProps: Omit<ModalProps, 'opened' | 'onClose'>[]
}

type GlobalModalContext = {
    openModal: (
        modalType: ModalTypes,
        modalProps?: ModalComponentTypes,
        globalModalProps?: Omit<ModalProps, 'opened' | 'onClose'>
    ) => void
    closeModal: () => void
    closeAllModals: () => void
    store: any
}

const initialState: GlobalModalContext = {
    openModal: () => {},
    closeModal: () => {},
    closeAllModals: () => {},
    store: null,
}

const GlobalModalContext = createContext<GlobalModalContext>(initialState)
export const useModal = () => useContext(GlobalModalContext)

const GlobalModal = ({ children }: { children: any }) => {
    const [store, setStore] = useState<Store>({
        modals: [],
        modalProps: [],
        globalModalProps: [],
    })
    const { modals, modalProps, globalModalProps } = store
    const theme = useMantineTheme()

    const openModal = useCallback<
        (
            arg0: ModalTypes,
            arg1?: ModalComponentTypes,
            arg2?: Omit<ModalProps, 'opened' | 'onClose'>
        ) => void
    >(
        (newModalType, newModalProps = {}, newGlobalModalProps = {}) => {
            setStore((prevStore) => ({
                ...prevStore,
                modals: [...prevStore.modals, newModalType],
                modalProps: [...prevStore.modalProps, newModalProps],
                globalModalProps: [
                    ...prevStore.globalModalProps,
                    newGlobalModalProps,
                ],
            }))
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [store]
    )

    const closeModal = useCallback(() => {
        let newModals: ModalTypes[] = []
        let newModalProps: ModalComponentTypes[] = []
        let newGlobalModalProps: Omit<ModalProps, 'opened' | 'onClose'>[] = []

        if (modals.length > 0) {
            newModals = modals.slice(0, -1)
            newModalProps = modalProps.slice(0, -1)
            newGlobalModalProps = globalModalProps.slice(0, -1)
        }
        setStore({
            ...store,
            modals: newModals,
            modalProps: newModalProps,
            globalModalProps: newGlobalModalProps,
        })
    }, [store, modals, modalProps, globalModalProps])

    const closeAllModals = useCallback(() => {
        setStore({
            ...store,
            modals: [],
            modalProps: [],
            globalModalProps: [],
        })
    }, [store])

    const memoStore = useMemo(() => {
        return {
            openModal,
            closeModal,
            closeAllModals,
            store,
        }
    }, [openModal, closeModal, closeAllModals, store])

    const renderModals = () => {
        const ModalComponents: React.FC<any>[] = modals.map(
            (modal) => MODAL_COMPONENTS[modal]
        )

        if (ModalComponents.length === 0) {
            return null
        }
        return (
            <>
                {ModalComponents.map((Component, index) => (
                    <ModalRoot
                        key={modals[index]}
                        opened={true}
                        onClose={closeModal}
                        size={'auto'}
                        {...globalModalProps[index]}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#009E4F',
                                }}
                            >
                                <ModalTitle
                                    w="100%"
                                    sx={{ textAlign: 'center' }}
                                >
                                    {(modalProps[index] as any)?.title ?? ''}
                                </ModalTitle>
                                <ModalCloseButton
                                    c="white"
                                    sx={{
                                        ':hover': { background: 'transparent' },
                                    }}
                                />
                            </ModalHeader>
                            <ModalBody p="2rem">
                                <Component {...(modalProps[index] as any)} />
                            </ModalBody>
                        </ModalContent>
                    </ModalRoot>
                ))}
            </>
        )
    }

    return (
        <GlobalModalContext.Provider value={memoStore}>
            {renderModals()}
            {children}
        </GlobalModalContext.Provider>
    )
}

export default GlobalModal
