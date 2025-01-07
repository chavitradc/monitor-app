
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
    title?: string;
    message: string;
    redirectTimeout?: number;
}

const ErrorDisplay = ({ title = "Error", message }: ErrorDisplayProps) => {


    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-gray-800">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md">
                <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <h3 className="text-red-800 font-medium">{title}</h3>
                </div>
                <p className="mt-2 text-red-700">{message}</p>
            </div>
        </div>
    );
};

export default ErrorDisplay;