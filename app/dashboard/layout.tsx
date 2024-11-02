'use client'
import { SideNav } from '@/components/index-clientside'
import { PageWrapperDashboard } from '@/components/index-serverside'
import GlobalModalProvider from '@/context/ModalProvider'
import '@/styles/globals.css'
import '@mantine/core/styles.css'
import { DatesProvider } from '@mantine/dates'
import 'dayjs/locale/ca'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-row w-full h-full">
            <GlobalModalProvider>
                <DatesProvider settings={{ locale: 'ca' }}>
                    <SideNav />
                    <PageWrapperDashboard>{children}</PageWrapperDashboard>
                </DatesProvider>
            </GlobalModalProvider>
        </div>
    )
}
