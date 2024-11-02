'use client'
import React, { useCallback, useEffect, useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SideNavItem } from '@/lib/types'
import { Icon } from '@iconify/react'
import Loading from './ui/loading'

const MenuItem = ({ item }: { item: SideNavItem }) => {
    const pathname = usePathname()
    const [subMenuOpen, setSubMenuOpen] = useState<boolean>(false)
    const [navigate, setNavigate] = useState<string>('')
    const [isLoading, setLoading] = useState<boolean>(false)
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen)
    }

    const handleLoader = useCallback(() => {
        setLoading(navigate !== '')

        if (isLoading === true && pathname === navigate) {
            setLoading(false)
            setNavigate('')
        }
    }, [isLoading, pathname, navigate])

    useEffect(() => {
        handleLoader()
    }, [pathname, handleLoader])

    return (
        <>
            <div>{isLoading && <Loading />}</div>
            <div className="">
                {item.submenu ? (
                    <>
                        <button
                            onClick={toggleSubMenu}
                            className={`flex flex-row items-center p-2 rounded-lg w-full justify-between hover:bg-primary hover:text-white  ${
                                pathname.includes(item.path)
                                    ? 'bg-primary text-white'
                                    : ''
                            }`}
                        >
                            <div className="flex flex-row space-x-4 items-center">
                                {item.icon}
                                <span className="font-semibold text-h4 flex text-left">
                                    {item.title}
                                </span>
                            </div>

                            <div
                                className={`${
                                    subMenuOpen ? 'rotate-180' : ''
                                } flex`}
                            >
                                <Icon
                                    icon="lucide:chevron-down"
                                    width="24"
                                    height="24"
                                />
                            </div>
                        </button>

                        {subMenuOpen && (
                            <div className="p-2 ml-2 flex flex-col space-y-1">
                                {item.subMenuItems?.map((subItem, idx) => {
                                    return (
                                        <Link
                                            key={idx}
                                            href={subItem.path}
                                            onClick={() => {
                                                if (
                                                    window.location.pathname !==
                                                    subItem.path
                                                ) {
                                                    setNavigate(subItem.path)
                                                    handleLoader()
                                                }
                                            }}
                                            className={`p-2 rounded-lg hover:bg-primary hover:text-white  ${
                                                subItem.path === pathname
                                                    ? 'font-bold'
                                                    : ''
                                            }`}
                                        >
                                            <span>{subItem.title}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    <Link
                        href={item.path}
                        onClick={() => {
                            if (window.location.pathname !== item.path) {
                                setNavigate(item.path)
                                handleLoader()
                            }
                        }}
                        className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-primary hover:text-white ${
                            item.path === pathname
                                ? 'bg-secondary text-foreground'
                                : ''
                        }`}
                    >
                        {item.icon}
                        <span className="font-semibold text-h4 flex">
                            {item.title}
                        </span>
                    </Link>
                )}
            </div>
        </>
    )
}

export default MenuItem
