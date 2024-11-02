import '@/styles/globals.css'
import '@mantine/core/styles.css'
import { PageWrapper } from '@/components/index-serverside'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <PageWrapper>{children}</PageWrapper>
        </div>
    )
}
