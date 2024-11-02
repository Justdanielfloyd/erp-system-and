'use client'
import { LogOut, Settings, User } from 'lucide-react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { setAuth, setJid } from '@/app/store/authSlice'

function ProfileSettings() {
    const isAuth = useAppSelector((state) => state.auth.isAuth)
    const dispatch = useAppDispatch()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>()

    useEffect(() => {
        if (isAuth) {
            setIsAuthenticated(true)
        } else {
            setIsAuthenticated(false)
        }
    }, [isAuth])

    const handleLogout = async () => {
        dispatch(setJid(''))
        dispatch(setAuth(false))
        await signOut()
    }

    if (isAuthenticated) {
        return (
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="hidden md:block cursor-pointer">
                            <div className="h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center text-center">
                                <span className="font-semibold text-sm">
                                    HQ
                                </span>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>El meu compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Configuració</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span onClick={handleLogout}>Tancar la sessió</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }
}
export default ProfileSettings
