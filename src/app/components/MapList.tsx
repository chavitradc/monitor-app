// components/MapList.tsx
"use client"
import { Map as MapIcon, Plus, Trash2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Map {
    _id: string;
    name: string;
}

interface MapListProps {
    maps: Map[];
    isCollapsed: boolean;
    onCreateMap: () => void;
    onDeleteMap: (id: string) => void;
    onRefreshMap: () => void;
}

export default function MapList({ maps, isCollapsed, onCreateMap, onDeleteMap, onRefreshMap }: MapListProps) {
    const pathname = usePathname();

    return (
        <div className={`mt-6 ${!isCollapsed && 'border-t border-gray-800 pt-6'} space-y-2`}>
            <div className="flex items-center justify-between mb-2">
                {!isCollapsed && <span className="text-sm text-gray-400">Maps</span>}
                {!isCollapsed && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onRefreshMap}
                            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                        >
                            <RefreshCw size={16} />
                        </button>
                        <button
                            onClick={onCreateMap}
                            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                )}
            </div>

            {maps.map((map) => {
                const isActive = pathname === `/maps/${map._id}`;

                return (
                    <div
                        key={map._id}
                        className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200
              ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <Link
                            href={`/maps/${map._id}`}
                            className={`flex items-center flex-1 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                        >
                            <MapIcon size={20} className={`${!isCollapsed && 'mr-3'}`} />
                            {!isCollapsed && (
                                <span className="font-medium truncate">{map.name}</span>
                            )}
                        </Link>
                        {!isCollapsed && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDeleteMap(map._id);
                                }}
                                className="p-1 rounded hover:bg-gray-700/50 text-gray-400 hover:text-red-400"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
