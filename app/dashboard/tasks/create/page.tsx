import { NewTaskForm } from '@/components/index-clientside'
import { Separator } from '@/components/ui/separator'

const CreateTaskPage = async () => {
    return (
        <div className="flex-1 flex flex-col h-full space-y-8">
            <div className="flex flex-col justify-between space-y-2">
                <h2 className="text-h1 text-primary font-bold tracking-tight">
                    Crear un full de treball
                </h2>
                <p className="text-muted-foreground">
                    Formulari per a generar un full de treball
                </p>
            </div>
            <Separator />
            <NewTaskForm />
        </div>
    )
}

export default CreateTaskPage
