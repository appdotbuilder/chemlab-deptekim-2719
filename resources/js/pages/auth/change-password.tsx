import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import InputError from '@/components/input-error';

interface Props {
    mustChangePassword: boolean;
    [key: string]: unknown;
}

interface PasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
    [key: string]: string | boolean;
}

export default function ChangePassword({ mustChangePassword }: Props) {
    const { data, setData, post, processing, errors } = useForm<PasswordFormData>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.update'));
    };

    return (
        <>
            <Head title="Change Password" />
            
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">🔐</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {mustChangePassword ? 'Change Your Password' : 'Update Password'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {mustChangePassword 
                                ? 'You must change your temporary password before continuing'
                                : 'Update your account password'
                            }
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {mustChangePassword ? 'Required Password Change' : 'Password Update'}
                            </CardTitle>
                            <CardDescription>
                                {mustChangePassword 
                                    ? 'Your current password is temporary and must be changed'
                                    : 'Enter your current password and choose a new one'
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {mustChangePassword && (
                                <Alert className="mb-6">
                                    <AlertDescription>
                                        🔒 <strong>Security Notice:</strong> You are using a temporary password. 
                                        Please choose a strong new password to secure your account.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {!mustChangePassword && (
                                    <div>
                                        <Label htmlFor="current_password">Current Password</Label>
                                        <Input
                                            id="current_password"
                                            type="password"
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            placeholder="Enter your current password"
                                            required
                                            disabled={processing}
                                            className="mt-1"
                                        />
                                        <InputError message={errors.current_password} className="mt-2" />
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter your new password"
                                        required
                                        disabled={processing}
                                        className="mt-1"
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Must be at least 8 characters with uppercase, lowercase, and numbers
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm your new password"
                                        required
                                        disabled={processing}
                                        className="mt-1"
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full"
                                >
                                    {processing ? 'Updating Password...' : '🔒 Update Password'}
                                </Button>
                            </form>

                            {!mustChangePassword && (
                                <div className="mt-6 text-center">
                                    <a
                                        href="/dashboard"
                                        className="text-sm text-blue-600 hover:text-blue-500"
                                    >
                                        ← Back to Dashboard
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {mustChangePassword && (
                        <Alert>
                            <AlertDescription>
                                💡 <strong>Tip:</strong> Once you change your password, you'll have full access to the application.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </>
    );
}