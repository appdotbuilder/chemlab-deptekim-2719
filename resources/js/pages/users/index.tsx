import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    student_id: string;
    phone: string;
    created_at: string;
    laboratory?: {
        id: number;
        name: string;
        code: string;
    };
}

interface PaginatedUsers {
    data: User[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface Props {
    users: PaginatedUsers;
    stats: {
        total: number;
        active: number;
        pending: number;
        by_role: Record<string, number>;
    };
    [key: string]: unknown;
}

export default function UsersIndex({ users, stats }: Props) {
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            active: { label: 'Active', color: 'bg-green-100 text-green-800' },
            pending_verification: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || { 
            label: status.charAt(0).toUpperCase() + status.slice(1),
            color: 'bg-gray-100 text-gray-800'
        };

        return (
            <Badge className={config.color}>
                {config.label}
            </Badge>
        );
    };

    const getRoleBadge = (role: string) => {
        const roleConfig = {
            admin: { label: 'Administrator', color: 'bg-purple-100 text-purple-800' },
            lab_assistant: { label: 'Lab Assistant', color: 'bg-blue-100 text-blue-800' },
            kepala_lab: { label: 'Head of Lab', color: 'bg-indigo-100 text-indigo-800' },
            dosen: { label: 'Lecturer', color: 'bg-teal-100 text-teal-800' },
            student: { label: 'Student', color: 'bg-green-100 text-green-800' },
        };

        const config = roleConfig[role as keyof typeof roleConfig] || { 
            label: role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' '),
            color: 'bg-gray-100 text-gray-800'
        };

        return (
            <Badge className={config.color}>
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title="User Management" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">👥 User Management</h1>
                        <p className="text-gray-600">Manage users and their roles</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Link href={route('users.pending-verification')}>
                            <Button variant="outline">
                                Pending Verification ({stats.pending})
                            </Button>
                        </Link>
                        <Link href={route('users.create')}>
                            <Button>
                                ➕ Create User
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                            <p className="text-xs text-gray-500">All registered users</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                            <p className="text-xs text-gray-500">Can access system</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                            <p className="text-xs text-gray-500">Awaiting verification</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-teal-600">{stats.by_role.student || 0}</div>
                            <p className="text-xs text-gray-500">Student accounts</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Users List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                            All users in the system with their roles and status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {users.data.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">👥</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                                <p className="text-gray-500">Start by creating your first user.</p>
                                <Link href={route('users.create')} className="mt-4 inline-block">
                                    <Button>Create User</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {users.data.map((user) => (
                                    <div
                                        key={user.id}
                                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-medium text-gray-900">
                                                        {user.name}
                                                    </h3>
                                                    {getRoleBadge(user.role)}
                                                    {getStatusBadge(user.status)}
                                                </div>
                                                
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p><strong>Email:</strong> {user.email}</p>
                                                    {user.student_id && (
                                                        <p><strong>ID:</strong> {user.student_id}</p>
                                                    )}
                                                    {user.phone && (
                                                        <p><strong>Phone:</strong> {user.phone}</p>
                                                    )}
                                                    {user.laboratory && (
                                                        <p><strong>Laboratory:</strong> {user.laboratory.name}</p>
                                                    )}
                                                    <p><strong>Created:</strong> {formatDate(user.created_at)}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <Link href={route('users.show', user.id)}>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </Link>
                                                <Link href={route('users.edit', user.id)}>
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}