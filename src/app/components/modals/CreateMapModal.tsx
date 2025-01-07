import React from "react";
import { Modal } from "./Modal";

interface CreateMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string) => void;
}

export const CreateMapModal: React.FC<CreateMapModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [mapName, setMapName] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mapName.trim()) return;
        onConfirm(mapName);
        setMapName('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Create New Map</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={mapName}
                        onChange={(e) => setMapName(e.target.value)}
                        placeholder="Enter map name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};