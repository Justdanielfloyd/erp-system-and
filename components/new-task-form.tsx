import { useAppDispatch, useAppSelector } from '@/app/store'
import { selectClients } from '@/app/store/clientsSlice'
import { useModal } from '@/context/ModalProvider'
import { newTaskFormSchema, TNewTaskFormSchema } from '@/data/zodSchema/newTask'
import { type Attachment, type TaskEntities } from '@/lib/types'
import { createTask, getTasksEntities } from '@/services/useTasks'
import { Box, Button, Select, Textarea, TextInput } from '@mantine/core'
import { DateInput, DatesProvider } from '@mantine/dates'
import { FormErrors, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import 'dayjs/locale/ca'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Dropzone from './ui/dropzone'

const NewTaskForm = () => {
    const { data: session } = useSession()
    const router = useRouter()

    const initialValues = {
        client: session?.user?.Codi_Client ?? '',
        location: '',
        date: new Date(),
        type: '',
        priority: '',
        description: '',
        specialty: '',
        apparel: '',
    }

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: initialValues,
        validate: zodResolver(newTaskFormSchema),
    })
    const clients = useAppSelector(selectClients)
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [taskEntities, setTaskEntities] = useState<TaskEntities | undefined>()
    // const [selectedAparell, setSelectedAparell] = useState<Apparel | undefined>(
    // undefined
    // )

    form.watch('client', ({ previousValue, value, touched, dirty }) => {
        if (!value) return
        getEntities()
    })

    const handleAttachmentChange = (attachments: Attachment[]) => {
        setAttachments(attachments)
    }

    const handleErrors = (errors: FormErrors) => {
        notifications.show({
            color: 'red',
            title: 'Error',
            message: 'Cal introduir els camps obligatoris',
        })
    }

    async function handleSubmit(data: TNewTaskFormSchema) {
        try {
            const reqBody = {
                ...data,
                client_code:
                    clients.clients.length > 1
                        ? form.getValues().client ?? ''
                        : session?.user?.Codi_Client ?? '',
                ...(attachments && { attachments }),
            }
            await createTask(reqBody, session?.user.Token)

            notifications.show({
                color: 'green',
                title: 'Full de treball creat',
                message: "El full de treball s'ha creat correctament.",
            })

            router.push('/dashboard/tasks')
        } catch (error) {
            notifications.show({
                color: 'red',
                title: 'Error',
                message:
                    "S'ha produït un error en crear el full de treball. Torneu-ho a provar.",
            })
        }
    }

    async function getEntities() {
        const selectedClient = form.getValues().client

        const response = await getTasksEntities(
            session?.user.Token ?? '',
            selectedClient
        )
        const newTaskEntities: TaskEntities = {
            locations: response.locations.filter(
                (location) => location.CODI_CLIENT === selectedClient
            ),
            types: response.types,
            priorities: response.priorities,
            specialties: response.specialties,
            apparels: response.apparels.filter(
                (apparel) => apparel.CODI_CLIENT === selectedClient
            ),
            states: response.states,
        }
        setTaskEntities(newTaskEntities)
    }

    // const showApparelTable = () => {
    //     openModal(MODAL_TYPES.APARELL_TABLE, {
    //         title: 'Selecciona un aparell',
    //         aparells: taskEntities?.apparels ?? [],
    //         setSelectedRow: setSelectedAparell,
    //         handleAction: () => {},
    //         closeAfterAction: true,
    //     })
    // }

    return (
        <DatesProvider
            settings={{
                consistentWeeks: true,
                locale: 'ca',
            }}
        >
            <form
                onSubmit={form.onSubmit(
                    (values) => handleSubmit(values),
                    handleErrors
                )}
                className="space-y-5 pb-8"
            >
                <Box className="grid md:grid-cols-2 gap-4">
                    <DateInput
                        withAsterisk
                        valueFormat="DD/MM/YYYY"
                        size="sm"
                        sx={{ width: '30%' }}
                        label="Data solicitud"
                        {...form.getInputProps('date')}
                    />
                </Box>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-3">
                        {(clients?.clients.length > 1 && (
                            <Select
                                withAsterisk
                                placeholder="Selecciona un client"
                                label="Client"
                                data={
                                    clients.clients.map((client, index) => ({
                                        value:
                                            client.CODI_CLIENT ??
                                            index.toString(),
                                        label: `${client.CODI_CLIENT} - ${client.NOM}`,
                                    })) || []
                                }
                                {...form.getInputProps('client')}
                                searchable
                                allowDeselect={false}
                            />
                        )) || (
                            <TextInput
                                withAsterisk
                                label="Client"
                                disabled
                                value={`${session?.user?.Codi_Client} - ${session?.user?.Nom}`}
                            />
                        )}

                        <Select
                            placeholder="Selecciona una ubicació"
                            label="Ubicació"
                            data={
                                taskEntities?.locations?.map((location) => ({
                                    value: location.CODI_UBICACIO,
                                    label: location.DESCRIPCIO,
                                })) ?? []
                            }
                            {...form.getInputProps('location')}
                            disabled={!clients || clients.clients.length === 0}
                            searchable
                            clearable
                        />

                        <Box
                            className={
                                'grid md:grid-cols-4 gap-4 ' +
                                (form.errors.apparel
                                    ? 'items-center'
                                    : 'items-end')
                            }
                        >
                            <Select
                                className="col-span-3"
                                label="Aparells"
                                placeholder="Selecciona un aparell"
                                // value={selectedAparell}
                                data={(taskEntities?.apparels
                                    ? form.getValues().location
                                        ? taskEntities.apparels.filter(
                                              (apparel) =>
                                                  apparel.CODI_UBICACIO ===
                                                  form.getValues().location
                                          )
                                        : taskEntities.apparels
                                    : []
                                ).map((apparel) => ({
                                    value: apparel.IDFAPARELLS.toString(),
                                    label: `${apparel.MARCA} ${apparel.MODEL} - ${apparel.REFERENCIA}`,
                                }))}
                                {...form.getInputProps('apparel')}
                                disabled={
                                    !clients || clients.clients.length === 0
                                }
                                searchable
                                clearable
                            />
                            {/* <Button
                                className="!bg-primary flex items-center justify-center cursor-pointer col-span-1"
                                onClick={showApparelTable}
                                leftSection={<FaSearch color="white" />}
                            >
                                Cerca
                            </Button> */}
                        </Box>

                        <Select
                            label="Tipus full de treball"
                            placeholder="Selecciona un tipus de full de treball"
                            data={
                                taskEntities?.types?.map((type) => ({
                                    value: type.CODI_TIPUS,
                                    label: type.DESCRIPCIO,
                                })) ?? []
                            }
                            {...form.getInputProps('type')}
                            disabled={!clients || clients.clients.length === 0}
                            searchable
                            clearable
                        />

                        <Select
                            label="Prioritat"
                            placeholder="Selecciona una prioritat"
                            data={
                                taskEntities?.priorities?.map((priority) => ({
                                    value: priority.CODI_TIPUS,
                                    label: priority.DESCRIPCIO,
                                })) ?? []
                            }
                            {...form.getInputProps('priority')}
                            disabled={!clients || clients.clients.length === 0}
                            searchable
                            clearable
                        />

                        <Select
                            label="Especialitat"
                            placeholder="Selecciona una especialitat"
                            data={
                                taskEntities?.specialties?.map((specialty) => ({
                                    value: specialty.CODI_TIPUS,
                                    label: specialty.DESCRIPCIO,
                                })) ?? []
                            }
                            {...form.getInputProps('specialty')}
                            disabled={!clients || clients.clients.length === 0}
                            searchable
                            clearable
                        />
                    </div>
                    <div className="flex flex-col space-y-3">
                        <Textarea
                            withAsterisk
                            placeholder="Descripció del treball a realitzar"
                            label="Descripció"
                            autosize
                            minRows={6}
                            {...form.getInputProps('description')}
                        />

                        <Dropzone
                            onFileChange={(files) => {
                                handleAttachmentChange(files)
                            }}
                            existingAttachments={attachments}
                        />
                    </div>
                </div>
                <Button type="submit" className="!bg-primary">
                    Crear full de treball
                </Button>
            </form>
        </DatesProvider>
    )
}

export default NewTaskForm
