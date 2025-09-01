import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    student_id: string;
    phone: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        student_id: '',
        phone: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Student Registration" description="Create your student account - UI Email required">
            <Head title="Register" />
            
            <Alert className="mb-6">
                <AlertDescription>
                    📚 <strong>Student Registration:</strong> Only students with @ui.ac.id email addresses can self-register. 
                    Staff accounts are created by administrators.
                </AlertDescription>
            </Alert>
            
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Your full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="your.name@ui.ac.id"
                        />
                        <InputError message={errors.email} />
                        <p className="text-xs text-gray-500">
                            Must use your UI email address (@ui.ac.id)
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="student_id">Student ID (Optional)</Label>
                        <Input
                            id="student_id"
                            type="text"
                            tabIndex={3}
                            value={data.student_id}
                            onChange={(e) => setData('student_id', e.target.value)}
                            disabled={processing}
                            placeholder="e.g., 2021123456"
                        />
                        <InputError message={errors.student_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                            id="phone"
                            type="tel"
                            tabIndex={4}
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            disabled={processing}
                            placeholder="+62812345678"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Create a strong password"
                        />
                        <InputError message={errors.password} />
                        <p className="text-xs text-gray-500">
                            At least 8 characters with uppercase, lowercase, and numbers
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={6}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm your password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={7} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create Student Account 🎓
                    </Button>
                </div>

                <Alert>
                    <AlertDescription>
                        ⏳ <strong>Account Verification:</strong> Your account will be pending verification after registration. 
                        An administrator will review and activate your account.
                    </AlertDescription>
                </Alert>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={8}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}