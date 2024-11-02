import { LoginFn } from '@/lib/types'

export const login: LoginFn = async (email, password) => {
    try {
        const request = await fetch(
            `${process.env.API_SERVER_LOCAL}${process.env.API_PATH}${process.env.LOGIN}`,
            {
                method: 'POST',
                body: JSON.stringify({ Login: email, Contrasenya: password }),
                headers: { 'Content-Type': 'application/json' },
            }
        )
        const user = await request.json()

        user.id = user.Codi_Client
        user.name = user.Nom
        user.email = email
        user.role = user.tipus
        if (request.ok) {
            return user
        } else throw new Error('User not found.')
    } catch (error) {
        console.error(error)
    }
}
