"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, User, LogOut, Menu, X, Server } from 'lucide-react';
import MapList from './MapList';
import { logout } from '@/action';
import { CreateMapModal } from './modals/CreateMapModal';
import { DeleteMapModal } from './modals/DeleteMapModal';
interface Map {
    _id: string;
    name: string;
}



const navElements = [
    { title: "Overview", href: "/", icon: Home },
    { title: "Profile", href: "/profile", icon: User },
    { title: "Pairing", href: "/pairing", icon: Server }
];

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [maps, setMaps] = useState<Map[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [mapToDelete, setMapToDelete] = useState<string | null>(null);

    const pathname = usePathname();
    const router = useRouter();
    const noSidebarRoutes = ["/login", "/register", "/maps"];



    const fetchMaps = async () => {
        try {
            const response = await fetch('/api/maps');
            const data = await response.json();
            setMaps(data); // Load maps into state
        } catch (error) {
            console.error('Failed to fetch maps:', error);
        }
    };

    useEffect(() => {
        fetchMaps();
    }, []);
    const handleLogout = async () => {
        try {

            setMaps([]);
            await logout();


        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    const createMap = async (name: string) => {
        try {
            const response = await fetch('/api/maps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (response.ok) {
                fetchMaps();
            }
        } catch (error) {
            console.error('Failed to create map:', error);
        }
    };

    const deleteMap = async (mapId: string) => {
        try {
            const response = await fetch(`/api/maps/${mapId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                if (pathname === `/maps/${mapId}`) {
                    router.push("/");
                }
                fetchMaps();
            }
        } catch (error) {
            console.error("Failed to delete map:", error);
        }
    };

    const handleDeleteClick = (mapId: string) => {
        setMapToDelete(mapId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (mapToDelete) {
            deleteMap(mapToDelete);
            setMapToDelete(null);
        }
    };

    if (noSidebarRoutes.includes(pathname)) {
        return null;
    }

    return (
        <>
            <aside className={`flex-col h-screen bg-gray-900 text-gray-100 shadow-xl
            transition-all duration-300 ease-in-out
            ${isCollapsed ? 'w-20' : 'w-72'}
            flex flex-col`}>
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
                                    ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                                    ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                                >
                                    <Icon size={20} className={`${!isCollapsed && 'mr-3'}`} />
                                    {!isCollapsed && <span className="font-medium">{item.title}</span>}
                                    {!isCollapsed && isActive && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-blue-400" />
                                    )}
                                </Link>
                            );
                        })}

                        <MapList
                            maps={maps}
                            isCollapsed={isCollapsed}
                            onCreateMap={() => setIsCreateModalOpen(true)}
                            onDeleteMap={handleDeleteClick}
                            onRefreshMap={fetchMaps}
                        />
                    </div>
                </nav>

                <div className="p-3 border-t border-gray-800">
                    <form action={handleLogout}>
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
            <CreateMapModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onConfirm={createMap}
            />

            <DeleteMapModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};

export default Sidebar;
