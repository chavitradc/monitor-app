import { Modal } from "./Modal";

interface DeleteMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteMapModal: React.FC<DeleteMapModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Delete Map</h2>
                <p className="text-gray-600 mb-4">Are you sure you want to delete this map? This action cannot be undone.</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
};