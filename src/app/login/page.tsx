"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "@/action"; // Import the login server action
import { hashPassword } from "@/utils/passwordUtils";

export default function LoginPage() {
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Hash the password before sending to server
        const password = formData.get('password') as string;
        const hashedPassword = hashPassword(password);
        formData.set('password', hashedPassword);

        try {
            const result = await login({ error: undefined }, formData);

            if (!result) {
                toast.error("Unable to process the login request. Please try again.", {
                    position: "top-center",
                    autoClose: 5000,
                });
                return;
            }

            if (result.error) {
                toast.error(result.error, {
                    position: "top-center",
                    autoClose: 5000,
                });
            } else {
                toast.success("Login successful", {
                    position: "top-center",
                    autoClose: 1500,
                    onClose: () => router.push("/"),
                });
            }
        } catch (err) {
            console.error("An error occurred during login:", err);
            toast.error("An error occurred during login. Please try again.", {
                position: "top-center",
                autoClose: 5000,
            });
        }
    };

    return (
        <section className="bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8">
            <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold leading-tight text-white text-center">
                        Sign In MONITOR-APP
                    </h1>
                    <p className="font-light leading-tight text-white text-center">
                        Enter your username and password to sign in
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block mb-2 text-sm font-medium text-white"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="username"
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-white"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white  focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                    >
                        Login
                    </button>

                    <p className="text-sm font-light text-gray-400 text-center">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-blue-500 hover:underline"
                        >
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
            <ToastContainer />
        </section>
    );
}
