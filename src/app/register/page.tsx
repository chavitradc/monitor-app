"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register } from "@/action";
import { hashPassword } from "@/utils/passwordUtils";

export default function RegisterPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        setPasswordError("");
        const formData = new FormData(e.currentTarget);

        // Hash the password before sending to server
        const hashedPassword = hashPassword(password);
        formData.set('password', hashedPassword);

        try {
            const result = await register(formData);
            if (!result) {
                toast.error("Unable to process the register request. Please try again.", {
                    position: "top-center",
                    autoClose: 5000,
                });
                return;
            }
            if (result.error) {
                toast.error(result.error || "Registration failed", {
                    position: "top-center",
                    autoClose: 5000,
                });
            } else if (result.success) {
                toast.success("User created successfully! Redirecting to login...", {
                    position: "top-center",
                    autoClose: 2000,
                    onClose: () => router.push("/login"),
                });
            }
        } catch (err) {
            console.error("Error during registration:", err);
            toast.error("An error occurred during registration. Please try again.", {
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
                        Create an account
                    </h1>
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
                                htmlFor="firstname"
                                className="block mb-2 text-sm font-medium text-white"
                            >
                                First name
                            </label>
                            <input
                                type="text"
                                name="firstname"
                                id="firstname"
                                placeholder="First name"

                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="lastname"
                                className="block mb-2 text-sm font-medium text-white"
                            >
                                Last name
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                id="lastname"
                                placeholder="Last name"

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

                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block mb-2 text-sm font-medium text-white"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="••••••••"

                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`bg-gray-700 border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${passwordError
                                    ? 'border-red-500'
                                    : 'border-gray-600'
                                    }`}
                            />
                            {passwordError && (
                                <p className="mt-1 text-sm text-red-500">
                                    {passwordError}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                    >
                        Create an account
                    </button>

                    <p className="text-sm font-light text-gray-400 text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-blue-500 hover:underline">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
            <ToastContainer />
        </section>
    );
}