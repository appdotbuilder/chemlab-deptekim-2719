import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface PasswordResetRequest {
    id: number;
    request_number: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        student_id?: string;
        laboratory?: {
            name: string;
            code: string;
        };
    };
    reason: string;
    identity_verification: {
        id_number: string;
        phone_number: string;
        additional_info?: string;
    };
    documents: {
        student_id_url?: string;
        identity_card_url?: string;
    };
    status: 'pending' | 'approved' | 'rejected' | 'processed';
    submitted_at: string;
    processed_at?: string;
    processed_by?: {
        id: number;
        name: string;
    };
    notes?: string;
    temporary_password?: string;
}

interface PasswordResetHelpProps {
    requests: PasswordResetRequest[];
    stats: {
        total_requests: number;
        pending_requests: number;
        processed_today: number;
        approval_rate: number;
    };
    filters?: {
        status?: string;
        search?: string;
        date_from?: string;
        date_to?: string;
    };
}

export function PasswordResetHelp({ requests, stats }: PasswordResetHelpProps) {
    const [processingRequest, setProcessingRequest] = useState<number | null>(null);
    const [tempPassword, setTempPassword] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'processed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case 'student': return '👩‍🎓';
            case 'lecturer': return '👨‍🏫';
            case 'lab_assistant': return '🔧';
            case 'lab_head': return '👨‍🔬';
            default: return '👤';
        }
    };

    const generateTempPassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setTempPassword(password);
    };

    const handleApproveRequest = (request: PasswordResetRequest) => {
        if (!tempPassword.trim()) {
            alert('Please generate a temporary password first.');
            return;
        }

        setProcessingRequest(request.id);
        
        router.post(route('password-reset-requests.approve', request.id), {
            temporary_password: tempPassword,
            notes: adminNotes
        }, {
            onSuccess: () => {
                setTempPassword('');
                setAdminNotes('');
                setProcessingRequest(null);
            },
            onError: () => {
                setProcessingRequest(null);
            }
        });
    };

    const handleRejectRequest = (request: PasswordResetRequest) => {
        if (!adminNotes.trim()) {
            alert('Please provide a reason for rejection.');
            return;
        }

        setProcessingRequest(request.id);
        
        router.post(route('password-reset-requests.reject', request.id), {
            notes: adminNotes
        }, {
            onSuccess: () => {
                setAdminNotes('');
                setProcessingRequest(null);
            },
            onError: () => {
                setProcessingRequest(null);
            }
        });
    };

    return (
        <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.total_requests}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <span className="text-2xl">🔑</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pending_requests}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Processed Today</p>
                                <p className="text-3xl font-bold text-green-600">{stats.processed_today}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.approval_rate}%</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input placeholder="🔍 Search requests..." />
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="📊 Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="processed">Processed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input type="date" placeholder="From Date" />
                        <Input type="date" placeholder="To Date" />
                    </div>
                </CardContent>
            </Card>

            {/* Password Reset Requests */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                🔑 Password Reset Requests
                            </CardTitle>
                            <CardDescription>
                                {requests.length} requests found
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                📤 Export Report
                            </Button>
                            <Button variant="outline">
                                📧 Bulk Notify
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {requests.length > 0 ? (
                        <div className="space-y-4">
                            {requests.map((request) => (
                                <div key={request.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {request.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">{getRoleIcon(request.user.role)}</span>
                                                    <h3 className="font-semibold text-lg">{request.user.name}</h3>
                                                    <Badge className={getStatusColor(request.status)}>
                                                        {request.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-600 mb-1">{request.user.email}</p>
                                                <p className="text-sm text-gray-500">
                                                    Request #{request.request_number} • 
                                                    Submitted {new Date(request.submitted_at).toLocaleDateString()}
                                                </p>
                                                {request.user.student_id && (
                                                    <p className="text-sm text-gray-500">
                                                        Student ID: {request.user.student_id}
                                                    </p>
                                                )}
                                                {request.user.laboratory && (
                                                    <p className="text-sm text-gray-500">
                                                        🏢 {request.user.laboratory.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        👁️ Review
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            🔑 Password Reset Request #{request.request_number}
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Review and process the password reset request
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="space-y-6">
                                                        {/* User Information */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                                        👤 User Information
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="space-y-3">
                                                                    <div>
                                                                        <Label className="font-semibold">Name</Label>
                                                                        <p>{request.user.name}</p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">Email</Label>
                                                                        <p>{request.user.email}</p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">Role</Label>
                                                                        <p className="flex items-center gap-2">
                                                                            {getRoleIcon(request.user.role)} {request.user.role}
                                                                        </p>
                                                                    </div>
                                                                    {request.user.student_id && (
                                                                        <div>
                                                                            <Label className="font-semibold">Student ID</Label>
                                                                            <p>{request.user.student_id}</p>
                                                                        </div>
                                                                    )}
                                                                    {request.user.laboratory && (
                                                                        <div>
                                                                            <Label className="font-semibold">Laboratory</Label>
                                                                            <p>{request.user.laboratory.name}</p>
                                                                        </div>
                                                                    )}
                                                                </CardContent>
                                                            </Card>

                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                                        📋 Request Details
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="space-y-3">
                                                                    <div>
                                                                        <Label className="font-semibold">Request Number</Label>
                                                                        <p>{request.request_number}</p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">Status</Label>
                                                                        <Badge className={getStatusColor(request.status)}>
                                                                            {request.status}
                                                                        </Badge>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">Submitted</Label>
                                                                        <p>{new Date(request.submitted_at).toLocaleString()}</p>
                                                                    </div>
                                                                    {request.processed_at && (
                                                                        <div>
                                                                            <Label className="font-semibold">Processed</Label>
                                                                            <p>{new Date(request.processed_at).toLocaleString()}</p>
                                                                        </div>
                                                                    )}
                                                                    {request.processed_by && (
                                                                        <div>
                                                                            <Label className="font-semibold">Processed By</Label>
                                                                            <p>{request.processed_by.name}</p>
                                                                        </div>
                                                                    )}
                                                                </CardContent>
                                                            </Card>
                                                        </div>

                                                        {/* Reason */}
                                                        <Card>
                                                            <CardHeader>
                                                                <CardTitle className="text-lg">📝 Reason for Reset</CardTitle>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <p className="p-3 bg-gray-50 rounded-lg">{request.reason}</p>
                                                            </CardContent>
                                                        </Card>

                                                        {/* Identity Verification */}
                                                        <Card>
                                                            <CardHeader>
                                                                <CardTitle className="text-lg flex items-center gap-2">
                                                                    🔒 Identity Verification
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-3">
                                                                <div>
                                                                    <Label className="font-semibold">ID Number</Label>
                                                                    <p>{request.identity_verification.id_number}</p>
                                                                </div>
                                                                <div>
                                                                    <Label className="font-semibold">Phone Number</Label>
                                                                    <p>{request.identity_verification.phone_number}</p>
                                                                </div>
                                                                {request.identity_verification.additional_info && (
                                                                    <div>
                                                                        <Label className="font-semibold">Additional Information</Label>
                                                                        <p className="p-3 bg-gray-50 rounded-lg">
                                                                            {request.identity_verification.additional_info}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </CardContent>
                                                        </Card>

                                                        {/* Documents */}
                                                        <Card>
                                                            <CardHeader>
                                                                <CardTitle className="text-lg flex items-center gap-2">
                                                                    📄 Supporting Documents
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                    {request.documents.student_id_url && (
                                                                        <div className="border rounded-lg p-4 text-center">
                                                                            <div className="text-2xl mb-2">🎓</div>
                                                                            <p className="font-semibold mb-2">Student ID</p>
                                                                            <Button variant="outline" size="sm">
                                                                                View Document
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                    {request.documents.identity_card_url && (
                                                                        <div className="border rounded-lg p-4 text-center">
                                                                            <div className="text-2xl mb-2">🆔</div>
                                                                            <p className="font-semibold mb-2">Identity Card</p>
                                                                            <Button variant="outline" size="sm">
                                                                                View Document
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </CardContent>
                                                        </Card>

                                                        {/* Existing Notes */}
                                                        {request.notes && (
                                                            <Card>
                                                                <CardHeader>
                                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                                        📝 Admin Notes
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <p className="p-3 bg-gray-50 rounded-lg">{request.notes}</p>
                                                                </CardContent>
                                                            </Card>
                                                        )}

                                                        {/* Processing Actions */}
                                                        {request.status === 'pending' && (
                                                            <Card className="border-blue-200 bg-blue-50">
                                                                <CardHeader>
                                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                                        ⚡ Process Request
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                    {/* Temporary Password Generator */}
                                                                    <div>
                                                                        <Label htmlFor="temp-password">Temporary Password</Label>
                                                                        <div className="flex gap-2 mt-1">
                                                                            <Input
                                                                                id="temp-password"
                                                                                value={tempPassword}
                                                                                onChange={(e) => setTempPassword(e.target.value)}
                                                                                placeholder="Generate or enter temporary password"
                                                                                className="flex-1"
                                                                            />
                                                                            <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                onClick={generateTempPassword}
                                                                            >
                                                                                🎲 Generate
                                                                            </Button>
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            This temporary password will be sent to the user via email
                                                                        </p>
                                                                    </div>

                                                                    {/* Admin Notes */}
                                                                    <div>
                                                                        <Label htmlFor="admin-notes">Admin Notes (Optional)</Label>
                                                                        <Textarea
                                                                            id="admin-notes"
                                                                            value={adminNotes}
                                                                            onChange={(e) => setAdminNotes(e.target.value)}
                                                                            placeholder="Add any notes about this request..."
                                                                            rows={3}
                                                                            className="mt-1"
                                                                        />
                                                                    </div>

                                                                    <Separator />

                                                                    {/* Action Buttons */}
                                                                    <div className="flex gap-3">
                                                                        <Button
                                                                            onClick={() => handleApproveRequest(request)}
                                                                            disabled={processingRequest === request.id}
                                                                            className="bg-green-600 hover:bg-green-700 flex-1"
                                                                        >
                                                                            {processingRequest === request.id ? '⏳ Processing...' : '✅ Approve & Send Password'}
                                                                        </Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={() => handleRejectRequest(request)}
                                                                            disabled={processingRequest === request.id}
                                                                            className="flex-1"
                                                                        >
                                                                            {processingRequest === request.id ? '⏳ Processing...' : '❌ Reject Request'}
                                                                        </Button>
                                                                    </div>

                                                                    <Alert>
                                                                        <AlertDescription>
                                                                            <strong>⚠️ Important:</strong> Once approved, the temporary password will be sent to the user's email. 
                                                                            The user will be required to change this password on first login.
                                                                        </AlertDescription>
                                                                    </Alert>
                                                                </CardContent>
                                                            </Card>
                                                        )}

                                                        {/* Processed Information */}
                                                        {request.status === 'processed' && request.temporary_password && (
                                                            <Card className="border-green-200 bg-green-50">
                                                                <CardHeader>
                                                                    <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                                                                        ✅ Request Processed
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <CardContent>
                                                                    <p className="text-green-800">
                                                                        Temporary password has been generated and sent to the user's email address.
                                                                    </p>
                                                                    <div className="mt-3 p-3 bg-white rounded border">
                                                                        <Label className="font-semibold">Temporary Password:</Label>
                                                                        <p className="font-mono text-lg">{request.temporary_password}</p>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        )}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            {request.status === 'pending' && (
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    ⚡ Quick Approve
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm font-semibold mb-1">Reason:</p>
                                        <p className="text-sm text-gray-700">{request.reason}</p>
                                    </div>

                                    {request.notes && (
                                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm font-semibold mb-1">Admin Notes:</p>
                                            <p className="text-sm text-blue-800">{request.notes}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔑</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Password Reset Requests</h3>
                            <p className="text-gray-600">All password reset requests have been processed.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}