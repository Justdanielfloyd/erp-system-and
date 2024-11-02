import { login } from '@/services/useLogin'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'Email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null
                const user = await login(
                    credentials.email,
                    credentials.password
                )
                return user ?? null
            },
        }),
    ],
    pages: {
        signIn: '/authentication',
    },
    callbacks: {
        // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.user = user
            }
            return token
        },
        // To use role in client components
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role
                session.user = token.user
            }
            return session
        },
    },
}
