import NextAuthProvider from '@/context/NextAuthProvider'
import '@/styles/globals.css'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import 'dayjs/locale/ca'
import { DatesProvider } from '@mantine/dates'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'
import { MantineEmotionProvider, emotionTransform } from '@mantine/emotion'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'
import '@mantine/tiptap/styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { RootStyleRegistry } from './EmotionRootStyleRegistry'
import PageWrapper from '@/components/page-wrapper'
import ReduxProvider from './store/ReduxProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Annex',
    description: 'Web to manage clients whorksheets',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ca" suppressHydrationWarning>
            <body className={inter.className}>
                <NextAuthProvider>
                    <ReduxProvider>
                        <RootStyleRegistry>
                            <MantineEmotionProvider>
                                <MantineProvider
                                    stylesTransform={emotionTransform}
                                >
                                    <DatesProvider
                                        settings={{
                                            consistentWeeks: true,
                                            locale: 'ca',
                                        }}
                                    >
                                        <Notifications />
                                        <PageWrapper>{children}</PageWrapper>
                                    </DatesProvider>
                                </MantineProvider>
                            </MantineEmotionProvider>
                        </RootStyleRegistry>
                    </ReduxProvider>
                </NextAuthProvider>
            </body>
        </html>
    )
}
