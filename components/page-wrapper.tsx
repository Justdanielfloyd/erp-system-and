import { ReactNode } from 'react'
import { Header, HeaderMobile } from '@/components/index-clientside'
import 'dayjs/locale/ca'
import { DatesProvider } from '@mantine/dates'

export default function PageWrapper({ children }: { children: ReactNode }) {
    return (
        <div className="h-screen w-screen">
            <Header />
            <HeaderMobile />
            <div className="absolute top-0 h-full w-full overflow-hidden">
                <DatesProvider
                    settings={{
                        consistentWeeks: true,
                        locale: 'ca',
                    }}
                >
                    {children}
                </DatesProvider>
            </div>
        </div>
    )
}
