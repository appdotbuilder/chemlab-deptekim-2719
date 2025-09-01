import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { UserManagement } from '@/components/user-management';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    laboratory?: {
        id: number;
        name: string;
        code: string;
    };
    created_at: string;
    last_login?: string;
    email_verified_at?: string;
}

interface Laboratory {
    id: number;
    name: string;
    code: string;
}

interface Props {
    users: {
        admins: User[];
        lab_staff: User[];
        lecturers: User[];
        students: User[];
    };
    laboratories: Laboratory[];
    filters?: {
        search?: string;
        status?: string;
        laboratory?: string;
        role?: string;
    };
    stats: {
        total_users: number;
        active_users: number;
        pending_users: number;
        verified_users: number;
    };
    [key: string]: unknown;
}

export default function UsersIndex({ users, laboratories, filters, stats }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'User Management', href: '/users' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            
            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            👥 User Management
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage users across different roles and laboratories
                        </p>
                    </div>
                </div>

                {/* User Management Component */}
                <UserManagement
                    users={users}
                    laboratories={laboratories}
                    filters={filters}
                    stats={stats}
                />
            </div>
        </AppLayout>
    );
}