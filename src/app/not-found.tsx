"use client";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function NotFoundPage() {
    const router = useRouter();

    const handleBackToHome = () => {
        router.push("/");
    };

    return (
        <section className="bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8">
            <div className="w-full max-w-md  rounded-lg shadow-lg border bg-gray-800 border-gray-700 p-6 space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold  text-white">404</h1>
                    <p className="text-xl font-medium  text-gray-300">
                        Oops! Page Not Found
                    </p>
                    <p className=" text-gray-400">
                        The page you&apos;re looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                <div className="text-center mt-4">
                    <button
                        onClick={handleBackToHome}
                        className="text-white  bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        Go Back to Home
                    </button>
                </div>
            </div>

        </section>
    );
}
