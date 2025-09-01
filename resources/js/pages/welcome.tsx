import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}



export default function Welcome() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;

    return (
        <>
            <Head title="ChemLab Deptekim - Laboratory Equipment Management System" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                {/* Header */}
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">🧪</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">ChemLab Deptekim</h1>
                                <p className="text-sm text-gray-600">Department of Chemical Engineering, FTUI</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
                                    >
                                        Log in
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm">
                                            Register
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <div className="relative isolate px-6 pt-14 lg:px-8">
                    <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
                        <div className="text-center">
                            <div className="mb-8">
                                <span className="text-6xl mb-4 block">🧪⚗️🔬</span>
                            </div>
                            
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                                <span className="text-blue-600">ChemLab</span> Deptekim
                            </h1>
                            
                            <p className="text-xl leading-8 text-gray-600 mb-2">
                                Laboratory Equipment Management System
                            </p>
                            
                            <p className="text-lg leading-8 text-gray-500 mb-10">
                                Department of Chemical Engineering, Faculty of Engineering, Universitas Indonesia
                            </p>
                            
                            <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600 mb-10">
                                Streamline your laboratory workflow with our integrated system for managing equipment loans, 
                                returns, and inventory across multiple chemical engineering laboratories.
                            </p>
                            
                            <div className="flex items-center justify-center gap-x-6">
                                {auth.user ? (
                                    <Link href="/dashboard">
                                        <Button size="lg" className="px-8 py-3">
                                            Go to Dashboard 🚀
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/register">
                                            <Button size="lg" className="px-8 py-3">
                                                Get Started 🚀
                                            </Button>
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
                                        >
                                            Sign in <span aria-hidden="true">→</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to manage your lab
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Our comprehensive system handles all aspects of laboratory equipment management
                        </p>
                    </div>
                    
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                        {/* Equipment Loans */}
                        <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="mb-4 p-3 bg-blue-100 rounded-full">
                                <span className="text-2xl">📋</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipment Loans</h3>
                            <p className="text-gray-600 text-sm">
                                Students and researchers can easily request laboratory equipment with approval workflows
                            </p>
                        </div>

                        {/* Inventory Management */}
                        <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="mb-4 p-3 bg-green-100 rounded-full">
                                <span className="text-2xl">📦</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventory Tracking</h3>
                            <p className="text-gray-600 text-sm">
                                Real-time tracking of equipment availability, condition, and location across all labs
                            </p>
                        </div>

                        {/* Multi-Lab Support */}
                        <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="mb-4 p-3 bg-purple-100 rounded-full">
                                <span className="text-2xl">🏢</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Lab Support</h3>
                            <p className="text-gray-600 text-sm">
                                Manage multiple laboratories with role-based access control for lab assistants
                            </p>
                        </div>

                        {/* Audit & Reports */}
                        <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="mb-4 p-3 bg-orange-100 rounded-full">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports & Audit</h3>
                            <p className="text-gray-600 text-sm">
                                Comprehensive reporting and audit trails for compliance and analysis
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Roles Section */}
                <div className="bg-gray-50 py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Built for every lab member
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Different interfaces and permissions for students, lab assistants, and administrators
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                            {/* Students */}
                            <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                                <div className="mb-4">
                                    <span className="text-4xl">👩‍🎓</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Students & Researchers</h3>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• Browse available equipment</li>
                                    <li>• Submit loan requests</li>
                                    <li>• Track request status</li>
                                    <li>• Manage borrowed items</li>
                                </ul>
                            </div>

                            {/* Lab Assistants */}
                            <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                                <div className="mb-4">
                                    <span className="text-4xl">👨‍🔬</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Lab Assistants</h3>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• Manage lab equipment</li>
                                    <li>• Approve/reject requests</li>
                                    <li>• Track equipment condition</li>
                                    <li>• Generate lab reports</li>
                                </ul>
                            </div>

                            {/* Admins */}
                            <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
                                <div className="mb-4">
                                    <span className="text-4xl">👨‍💼</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Administrators</h3>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• System-wide management</li>
                                    <li>• User and role management</li>
                                    <li>• Cross-lab analytics</li>
                                    <li>• Security and compliance</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-blue-600 py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Ready to modernize your lab management?
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                                Join the Department of Chemical Engineering, FTUI in creating a more efficient laboratory environment.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                {auth.user ? (
                                    <Link href="/dashboard">
                                        <Button size="lg" variant="secondary" className="px-8 py-3">
                                            Access Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/register">
                                        <Button size="lg" variant="secondary" className="px-8 py-3">
                                            Create Account
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white py-12">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <span className="text-2xl">🧪</span>
                                <span className="text-lg font-semibold text-gray-900">ChemLab Deptekim</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Department of Chemical Engineering, Faculty of Engineering
                            </p>
                            <p className="text-sm text-gray-600">
                                Universitas Indonesia
                            </p>
                            <p className="mt-4 text-xs text-gray-500">
                                © 2024 ChemLab Deptekim. Laboratory Equipment Management System.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}