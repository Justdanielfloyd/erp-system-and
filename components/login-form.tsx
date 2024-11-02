'use client'
import '@/styles/globals.css'
import '@mantine/core/styles.css'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getSession, signIn } from 'next-auth/react'
import { TLoginSchema, loginSchema } from '@/data/zodSchema/login'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { setAuth, setJid } from '@/app/store/authSlice'
import { useAppDispatch } from '@/app/store'

const LoginForm = () => {
    const { toast } = useToast()
    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl')

    const form = useForm<TLoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const {
        handleSubmit,
        formState: { isSubmitting, isDirty, isValid },
    } = form

    const onSubmit = async (data: TLoginSchema) => {
        const { email, password } = data

        const response = await signIn('credentials', {
            redirect: Boolean(false),
            email,
            password,
            callbackUrl: callbackUrl || '/',
        })

        if (!response?.ok) {
            toast({
                variant: 'destructive',
                title: 'Authentication Failed',
                description:
                    response?.error === 'CredentialsSignin'
                        ? 'Incorrect email or password.'
                        : response?.error,
                action: (
                    <ToastAction altText="Try again">Try again</ToastAction>
                ),
            })
        } else if (response?.ok && response?.url) {
            const session = await getSession()
            if (!session) throw new Error("Couldn't get session.")
            const user = session.user
            dispatch(setJid(user.Token))
            dispatch(setAuth(true))
            router.push(response?.url)
        }
    }

    return (
        <main className="absolute top-2/4 -translate-y-2/4 left-2/4 -translate-x-2/4 w-1/2 max-sm:w-9/12 flex gap-y-11 items-center justify-center">
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 rounded-lg w-full h-full"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo electrónico</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="email@mail.com"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contrasenya</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="*****"
                                        autoComplete="off"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={!isDirty || !isValid || isSubmitting}
                    >
                        {isSubmitting ? (
                            <div role="status"></div>
                        ) : (
                            'Iniciar sesión'
                        )}
                    </Button>
                </form>
            </Form>
        </main>
    )
}

export default LoginForm
