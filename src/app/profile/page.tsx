import { getSession } from "@/action";
import { User, Calendar, Building, LucideIcon } from 'lucide-react';
import { SessionData } from '@/lib/type';
import UserModel from '@/models/User';
import { connectDB } from '@/lib/db';

interface ProfileItemProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

const ProfileItem = ({ icon: Icon, label, value }: ProfileItemProps) => {
    return (
        <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center mb-2">
                <Icon className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-gray-400">{label}</span>
            </div>
            <p className="text-gray-100 font-medium ml-7">{value || '-'}</p>
        </div>
    );
};

const formatMemberSince = (date: Date) => {
    return date.getFullYear().toString();
};

export default async function Profile() {
    const session = await getSession() as SessionData;

    let memberSince = '-';
    if (session.userId) {
        try {
            await connectDB();
            const user = await UserModel.findById(session.userId);
            if (user?.createdAt) {
                memberSince = formatMemberSince(user.createdAt);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    return (
        <main className="p-6 min-h-screen bg-gray-800">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-100">Profile</h1>
                <p className="text-gray-400 mt-2">Manage your personal information and settings</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-100">Personal Information</h2>
                    </div>
                    <div className="p-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                                <span className="text-3xl font-bold text-white">
                                    {session.firstname?.[0]?.toUpperCase() || session.username?.[0]?.toUpperCase()}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <ProfileItem
                                        icon={User}
                                        label="Username"
                                        value={session.username || '-'}
                                    />
                                    <ProfileItem
                                        icon={User}
                                        label="Full Name"
                                        value={`${session.firstname || ''} ${session.lastname || ''}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                    <div className="p-6 border-b border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-100">Account Overview</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 text-blue-400 mr-3" />
                                    <span className="text-gray-400">Member Since</span>
                                </div>
                                <span className="text-gray-200">{memberSince}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                                <div className="flex items-center">
                                    <Building className="w-5 h-5 text-blue-400 mr-3" />
                                    <span className="text-gray-400">Role</span>
                                </div>
                                <span className="text-gray-200">User</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}