import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PasswordResetRequest {
    id: number;
    token: string;
    status: string;
    requester_notes: string;
    approval_notes: string;
    expires_at: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        laboratory?: {
            name: string;
        };
    };
    approver?: {
        id: number;
        name: string;
        email: string;
    };
}

interface PaginatedRequests {
    data: PasswordResetRequest[];
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
    requests: PaginatedRequests;
    stats: {
        pending: number;
        total: number;
    };
    [key: string]: unknown;
}

export default function PasswordResetRequestsIndex({ requests, stats }: Props) {
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { variant: 'default', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            approved: { variant: 'default', label: 'Approved', color: 'bg-blue-100 text-blue-800' },
            completed: { variant: 'default', label: 'Completed', color: 'bg-green-100 text-green-800' },
            rejected: { variant: 'destructive', label: 'Rejected', color: 'bg-red-100 text-red-800' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || { 
            variant: 'default', 
            label: status.charAt(0).toUpperCase() + status.slice(1),
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
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isExpired = (expiresAt: string) => {
        return new Date(expiresAt) < new Date();
    };

    return (
        <AppLayout>
            <Head title="Password Reset Requests" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">🔐 Password Reset Requests</h1>
                        <p className="text-gray-600">Manage password reset requests from users</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                            <p className="text-xs text-gray-500">Awaiting review</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                            <p className="text-xs text-gray-500">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Active Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {requests.data.filter(r => r.status === 'pending' && !isExpired(r.expires_at)).length}
                            </div>
                            <p className="text-xs text-gray-500">Not expired</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Requests List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Password Reset Requests</CardTitle>
                        <CardDescription>
                            Review and approve password reset requests from users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {requests.data.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔐</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No password reset requests</h3>
                                <p className="text-gray-500">There are no password reset requests to review.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {requests.data.map((request) => (
                                    <div
                                        key={request.id}
                                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-medium text-gray-900">
                                                        {request.user.name}
                                                    </h3>
                                                    {getStatusBadge(request.status)}
                                                    {isExpired(request.expires_at) && request.status === 'pending' && (
                                                        <Badge variant="outline" className="bg-gray-100 text-gray-600">
                                                            Expired
                                                        </Badge>
                                                    )}
                                                </div>
                                                
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p><strong>Email:</strong> {request.user.email}</p>
                                                    <p><strong>Role:</strong> {request.user.role.replace('_', ' ').toUpperCase()}</p>
                                                    {request.user.laboratory && (
                                                        <p><strong>Laboratory:</strong> {request.user.laboratory.name}</p>
                                                    )}
                                                    <p><strong>Submitted:</strong> {formatDate(request.created_at)}</p>
                                                    <p><strong>Expires:</strong> {formatDate(request.expires_at)}</p>
                                                    
                                                    {request.requester_notes && (
                                                        <p><strong>Notes:</strong> {request.requester_notes}</p>
                                                    )}
                                                    
                                                    {request.approver && (
                                                        <p><strong>Reviewed by:</strong> {request.approver.name}</p>
                                                    )}
                                                    
                                                    {request.approval_notes && (
                                                        <p><strong>Review Notes:</strong> {request.approval_notes}</p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <Link href={route('password-reset-requests.show', request.id)}>
                                                    <Button variant="outline" size="sm">
                                                        View Details
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