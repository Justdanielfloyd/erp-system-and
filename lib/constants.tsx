import React from 'react'

import { Icon } from '@iconify/react'
import { SideNavItem } from './types'

export const SIDENAV_ITEMS: SideNavItem[] = [
    {
        title: 'Home',
        path: '/dashboard',
        icon: <Icon icon="lucide:home" width="24" height="24" />,
    },
    {
        title: 'Full de Treball',
        path: '/tasks',
        icon: <Icon icon="lucide:folder" width="24" height="24" />,
        submenu: true,
        subMenuItems: [
            { title: 'Crear nou', path: '/dashboard/tasks/create' },
            { title: 'Llistat fulls de treball', path: '/dashboard/tasks' },
            { title: 'Informe de despeses', path: '/dashboard/reports' },
        ],
    },
]
