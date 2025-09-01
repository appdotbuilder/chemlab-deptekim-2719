import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import InputError from '@/components/input-error';

interface RequestFormData {
    email: string;
    requester_notes: string;
    [key: string]: string;
}

export default function CreatePasswordResetRequest() {
    const { data, setData, post, processing, errors } = useForm<RequestFormData>({
        email: '',
        requester_notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password-reset-request.store'));
    };

    return (
        <>
            <Head title="Request Password Reset" />
            
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">🔐</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Password Reset Request</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Submit a request to reset your password. An administrator will review and approve your request.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Request Form</CardTitle>
                            <CardDescription>
                                Please provide your email address and any additional notes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Alert className="mb-6">
                                <AlertDescription>
                                    💡 <strong>Note:</strong> Password reset requests are manually reviewed by administrators. 
                                    You will receive a temporary password once approved.
                                </AlertDescription>
                            </Alert>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="your.email@ui.ac.id or your.email@che.ui.ac.id"
                                        required
                                        disabled={processing}
                                        className="mt-1"
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <Label htmlFor="requester_notes">Additional Notes (Optional)</Label>
                                    <Textarea
                                        id="requester_notes"
                                        value={data.requester_notes}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('requester_notes', e.target.value)}
                                        placeholder="Any additional information that might help the administrator..."
                                        disabled={processing}
                                        className="mt-1"
                                        rows={3}
                                    />
                                    <InputError message={errors.requester_notes} className="mt-2" />
                                    <p className="text-xs text-gray-500 mt-1">
                                        You can provide context about why you need a password reset
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full"
                                >
                                    {processing ? 'Submitting Request...' : 'Submit Password Reset Request 📤'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <a
                                    href="/login"
                                    className="text-sm text-blue-600 hover:text-blue-500"
                                >
                                    ← Back to Login
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}