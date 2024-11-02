'use client'

import React from 'react'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

import useScroll from '@/services/useScroll'
import { cn } from '@/lib/utils'
import { ProfileSettings } from '@/components/index-clientside'
import { AnnexLogo } from '@/app/assets'

const Header = () => {
    const scrolled = useScroll(5)
    const selectedLayout = useSelectedLayoutSegment()

    return (
        <div
            className={cn(
                `sticky inset-x-0 top-0 z-30 px-4 transition-all border-b border-muted`,
                {
                    'border-b border-muted backdrop-blur-md': scrolled,
                    'border-b border-muted bg-background': selectedLayout,
                }
            )}
        >
            <div className="flex h-[47px] items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/"
                        className="flex flex-row space-x-3 items-center justify-center"
                    >
                        <AnnexLogo height={30} />
                    </Link>
                </div>
                <ProfileSettings />
            </div>
        </div>
    )
}

export default Header
