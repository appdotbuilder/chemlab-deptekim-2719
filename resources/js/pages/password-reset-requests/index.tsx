import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PasswordResetHelp } from '@/components/password-reset-help';

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

interface Props {
    passwordResetRequests: PasswordResetRequest[];
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
    [key: string]: unknown;
}

export default function PasswordResetRequestsIndex({ passwordResetRequests, stats, filters }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Password Reset Help', href: '/password-reset-requests' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password Reset Help" />
            
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            🔑 Password Reset Help
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Process and manage user password reset requests with secure verification
                        </p>
                    </div>
                </div>

                <PasswordResetHelp
                    requests={passwordResetRequests}
                    stats={stats}
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
}