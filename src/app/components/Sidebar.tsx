"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, LogOut, Menu, X, Server, } from 'lucide-react';
import { logout } from '@/action';



const navElements = [
    {
        title: "Overview",
        href: "/",
        icon: Home
    },
    {
        title: "Pairing",
        href: "/pairing",
        icon: Server
    },
    {
        title: "Profile",
        href: "/profile",
        icon: User
    },


];

const Sidebar = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const noSidebarRoutes = ["/login", "/register",];

    const isValidRoute = navElements.some(route => route.href === pathname);
    if (noSidebarRoutes.includes(pathname) || !isValidRoute) {
        return null;
    }


    return (
        <aside
            className={`flex-col h-screen bg-gray-900 text-gray-100 shadow-xl
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-72'}
        flex flex-col`}
        >
            {/* Header */}
            <div className="relative h-16 flex items-center justify-between px-4 bg-gray-800/50">
                {!isCollapsed && (
                    <Link href={"/"}>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                <span className="font-bold text-lg">M</span>
                            </div>
                            <h1 className="font-bold text-xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                                Monitor
                            </h1>
                        </div>
                    </Link>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute right-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    {isCollapsed ? <Menu size={20} /> : <X size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6">
                <div className="space-y-2">
                    {navElements.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200
                  ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                  ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                            >
                                <Icon size={20} className={`${!isCollapsed && 'mr-3'}`} />
                                {!isCollapsed && (
                                    <span className="font-medium">{item.title}</span>
                                )}
                                {!isCollapsed && isActive && (
                                    <div className="ml-auto w-2 h-2 rounded-full bg-blue-400" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer with Logout */}
            <div className="p-3 border-t border-gray-800">
                <form action={logout}>
                    <button
                        className={`w-full flex items-center px-3 py-3 rounded-lg
              text-red-400 hover:bg-red-500/10 hover:text-red-300
              transition-colors duration-200
              ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                    >
                        <LogOut size={20} className={`${!isCollapsed && 'mr-3'}`} />
                        {!isCollapsed && <span className="font-medium">Logout</span>}
                    </button>
                </form>
            </div>
        </aside>
    );
};

export default Sidebar;