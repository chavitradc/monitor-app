"use client";

import React, { useState } from "react";
import Image from "next/image";

const PairingPage = () => {
    const [serverIP, setServerIP] = useState("");
    const [status, setStatus] = useState("Disconnected");
    const [videoSrc, setVideoSrc] = useState("");
    const [message, setMessage] = useState("");

    const handleConnect = async () => {
        if (!serverIP) {
            setStatus("Invalid IP Address");
            return;
        }
        setVideoSrc(`http://${serverIP}:5000/video_feed`);
        setStatus("Connecting...");

        try {
            const socket = new WebSocket(`ws://${serverIP}:12345`);
            socket.onopen = () => setStatus("Connected");
            socket.onmessage = (event) => setMessage(event.data);
            socket.onerror = () => setStatus("Connection Failed");
            socket.onclose = () => setStatus("Disconnected");
        } catch (error) {
            console.error("Connection error:", error);
            setStatus("Connection Failed");
        }
    };

    return (
        <main className="p-6 min-h-screen bg-gray-800">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100">Device Pairing</h1>
                <p className="text-gray-400 mt-2">Connect and manage your devices</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-100">Connection Settings</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="serverIP" className="block text-sm font-medium text-gray-400 mb-2">
                                    Python Server IP
                                </label>
                                <input
                                    id="serverIP"
                                    type="text"
                                    placeholder="Enter server IP (e.g., 192.168.1.105)"
                                    value={serverIP}
                                    onChange={(e) => setServerIP(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                                />
                            </div>

                            <button
                                onClick={handleConnect}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                            >
                                Connect to Device
                            </button>

                            <div className="space-y-4">
                                <div className="p-4 bg-gray-800/50 rounded-lg">
                                    <span className="text-gray-400">Connection Status</span>
                                    <p className={`mt-1 font-medium ${status === "Connected" ? "text-green-400" :
                                            status === "Connection Failed" ? "text-red-400" :
                                                "text-gray-100"
                                        }`}>
                                        {status}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-800/50 rounded-lg">
                                    <span className="text-gray-400">Last Message</span>
                                    <p className="mt-1 font-medium text-gray-100">
                                        {message || "No messages received"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-100">Live Video Feed</h2>
                    </div>
                    <div className="p-6">
                        {videoSrc ? (
                            <div className="aspect-video relative">
                                <Image
                                    src={videoSrc}
                                    alt="Live Stream"
                                    fill
                                    className="object-cover rounded-lg"
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[400px] bg-gray-800/50 rounded-lg">
                                <p className="text-gray-400">Connect to a device to view live feed</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PairingPage;