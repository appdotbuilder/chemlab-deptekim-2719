import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import InputError from '@/components/input-error';

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
            id: number;
            name: string;
            code: string;
        };
    };
    approver?: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    request: PasswordResetRequest;
    [key: string]: unknown;
}

interface ApprovalFormData {
    action: string;
    approval_notes: string;
    [key: string]: string;
}

export default function ShowPasswordResetRequest({ request }: Props) {
    const { data, setData, patch, processing, errors } = useForm<ApprovalFormData>({
        action: '',
        approval_notes: '',
    });

    const handleApprovalSubmit = (action: 'approve' | 'reject') => {
        setData('action', action);
        patch(route('password-reset-requests.update', request.id), {
            preserveState: true,
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            approved: { label: 'Approved', color: 'bg-blue-100 text-blue-800' },
            completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
            rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isExpired = () => {
        return new Date(request.expires_at) < new Date();
    };

    const canTakeAction = () => {
        return request.status === 'pending' && !isExpired();
    };

    return (
        <AppLayout>
            <Head title={`Password Reset Request - ${request.user.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">🔐 Password Reset Request</h1>
                        <p className="text-gray-600">Review and manage password reset request</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.visit(route('password-reset-requests.index'))}
                    >
                        ← Back to List
                    </Button>
                </div>

                {/* Request Status Alert */}
                {isExpired() && request.status === 'pending' && (
                    <Alert>
                        <AlertDescription>
                            ⚠️ <strong>Expired Request:</strong> This password reset request has expired and cannot be processed.
                        </AlertDescription>
                    </Alert>
                )}

                {request.status === 'completed' && (
                    <Alert>
                        <AlertDescription>
                            ✅ <strong>Completed:</strong> This password reset has been completed. A temporary password was provided to the user.
                        </AlertDescription>
                    </Alert>
                )}

                {request.status === 'rejected' && (
                    <Alert>
                        <AlertDescription>
                            ❌ <strong>Rejected:</strong> This password reset request has been rejected.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Request Details */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Request Details</CardTitle>
                                {getStatusBadge(request.status)}
                            </div>
                            <CardDescription>
                                Information about the password reset request
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-900">Requester</Label>
                                <p className="text-gray-600">{request.user.name}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-900">Email</Label>
                                <p className="text-gray-600">{request.user.email}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-900">Role</Label>
                                <p className="text-gray-600 capitalize">
                                    {request.user.role.replace('_', ' ')}
                                </p>
                            </div>

                            {request.user.laboratory && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-900">Laboratory</Label>
                                    <p className="text-gray-600">
                                        {request.user.laboratory.name} ({request.user.laboratory.code})
                                    </p>
                                </div>
                            )}

                            <div>
                                <Label className="text-sm font-medium text-gray-900">Request Submitted</Label>
                                <p className="text-gray-600">{formatDate(request.created_at)}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-900">Expires At</Label>
                                <p className={`${isExpired() ? 'text-red-600' : 'text-gray-600'}`}>
                                    {formatDate(request.expires_at)}
                                    {isExpired() && ' (Expired)'}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-900">Token</Label>
                                <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                                    {request.token}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Request Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Notes</CardTitle>
                            <CardDescription>
                                Additional information provided by the requester
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {request.requester_notes ? (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700">{request.requester_notes}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No additional notes provided</p>
                            )}

                            {request.approver && (
                                <div className="mt-6 pt-6 border-t">
                                    <Label className="text-sm font-medium text-gray-900">Reviewed By</Label>
                                    <p className="text-gray-600 mb-3">{request.approver.name}</p>
                                    
                                    {request.approval_notes && (
                                        <>
                                            <Label className="text-sm font-medium text-gray-900">Review Notes</Label>
                                            <div className="bg-gray-50 p-4 rounded-lg mt-1">
                                                <p className="text-gray-700">{request.approval_notes}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Action Panel */}
                {canTakeAction() && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Review Actions</CardTitle>
                            <CardDescription>
                                Approve or reject this password reset request
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="approval_notes">Review Notes (Optional)</Label>
                                <Textarea
                                    id="approval_notes"
                                    value={data.approval_notes}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('approval_notes', e.target.value)}
                                    placeholder="Add any notes about your decision..."
                                    disabled={processing}
                                    className="mt-1"
                                    rows={3}
                                />
                                <InputError message={errors.approval_notes} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => handleApprovalSubmit('approve')}
                                    disabled={processing}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {processing && data.action === 'approve' ? 'Approving...' : '✅ Approve Request'}
                                </Button>

                                <Button
                                    onClick={() => handleApprovalSubmit('reject')}
                                    disabled={processing}
                                    variant="destructive"
                                >
                                    {processing && data.action === 'reject' ? 'Rejecting...' : '❌ Reject Request'}
                                </Button>
                            </div>

                            <Alert>
                                <AlertDescription>
                                    <strong>Approve:</strong> A temporary password will be generated and the user will be required to change it on next login.<br/>
                                    <strong>Reject:</strong> The user will need to submit a new request if needed.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}