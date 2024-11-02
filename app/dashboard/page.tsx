import ChartsComponent from '@/components/charts/ChartsContainer'
import { Separator } from '@/components/ui/separator'
import '@/styles/globals.css'
import '@mantine/charts/styles.css'
import { getServerSession } from 'next-auth'

const HomePage = async () => {
    const session = await getServerSession()

    return (
        <div className="h-full flex-1 flex-col space-y-2 p-2">
            <div className="flex flex-col">
                <div className="ht-8 flex flex-row justify-between items-center">
                    <h2 className="text-h1 font-bold tracking-tight text-primary">
                        Benvingut {session?.user.name}!
                    </h2>
                </div>
                <Separator className="my-2" />
                <ChartsComponent />
            </div>
        </div>
    )
}

export default HomePage
