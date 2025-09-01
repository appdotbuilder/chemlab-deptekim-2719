import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface SOP {
    title: string;
    description: string;
    laboratory: string;
    downloadUrl: string;
}

const faqs: FAQ[] = [
    {
        question: "How do I request laboratory equipment?",
        answer: "Register for an account, browse available equipment, select the items you need, fill out the request form including JSA document upload, and wait for approval from the lab assistant."
    },
    {
        question: "Who can approve my equipment loan request?",
        answer: "Equipment loan requests must be approved by the lab assistant (Laboran) or head of laboratory (Kepala Lab) of the specific laboratory where the equipment is located."
    },
    {
        question: "What is JSA and why is it required?",
        answer: "JSA (Job Safety Analysis) is a safety document that identifies potential hazards and safety measures for laboratory work. It's mandatory for all equipment loans to ensure safe usage."
    },
    {
        question: "How long can I borrow equipment?",
        answer: "Loan duration depends on the equipment type and your academic status. Typical loans range from 1 day to 2 weeks. Specific limits are set by each laboratory."
    },
    {
        question: "What happens if I return equipment late?",
        answer: "Late returns may result in penalties and could affect your ability to borrow equipment in the future. Contact the lab assistant immediately if you anticipate delays."
    },
    {
        question: "Can I extend my loan period?",
        answer: "Extension requests must be submitted before the due date and are subject to equipment availability and lab assistant approval."
    }
];

const sampleSOPs: SOP[] = [
    {
        title: "Safety Procedures for Chemical Handling",
        description: "Comprehensive guide for safe handling of chemicals in all laboratory environments",
        laboratory: "General Safety",
        downloadUrl: "#"
    },
    {
        title: "Equipment Maintenance Protocol",
        description: "Standard operating procedures for routine maintenance of laboratory equipment",
        laboratory: "All Laboratories",
        downloadUrl: "#"
    },
    {
        title: "Waste Disposal Guidelines",
        description: "Proper disposal methods for different types of laboratory waste",
        laboratory: "Environmental Safety",
        downloadUrl: "#"
    },
    {
        title: "Emergency Response Procedures",
        description: "Step-by-step emergency response procedures for laboratory incidents",
        laboratory: "General Safety",
        downloadUrl: "#"
    }
];

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <>
            <Head title="ChemLab Deptekim - Laboratory Equipment Management System" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                {/* Header */}
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">🧪</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">ChemLab Deptekim</h1>
                                <p className="text-sm text-gray-600">Department of Chemical Engineering, FTUI</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">Welcome, {auth.user.name}</span>
                                    <Link
                                        href="/dashboard"
                                        className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
                                    >
                                        Dashboard 📊
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm" className="shadow-lg">
                                            Register ✨
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="relative isolate px-6 pt-14 lg:px-8">
                    <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
                        <div className="text-center">
                            <div className="mb-8">
                                <span className="text-6xl mb-4 block animate-pulse">🧪⚗️🔬</span>
                            </div>
                            
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    ChemLab
                                </span>{' '}
                                Deptekim
                            </h1>
                            
                            <p className="text-xl leading-8 text-gray-600 mb-2 font-semibold">
                                🏭 Laboratory Equipment Management System
                            </p>
                            
                            <p className="text-lg leading-8 text-gray-500 mb-10">
                                Department of Chemical Engineering, Faculty of Engineering, Universitas Indonesia
                            </p>
                            
                            <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600 mb-10">
                                Streamline your laboratory workflow with our integrated system for managing equipment loans, 
                                returns, and inventory across multiple chemical engineering laboratories. 🚀
                            </p>
                            
                            <div className="flex items-center justify-center gap-x-6 mb-12">
                                {auth.user ? (
                                    <Link href="/dashboard">
                                        <Button size="lg" className="px-8 py-3 shadow-lg hover:shadow-xl transition-all">
                                            Go to Dashboard 🚀
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/register">
                                            <Button size="lg" className="px-8 py-3 shadow-lg hover:shadow-xl transition-all">
                                                Get Started 🚀
                                            </Button>
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
                                        >
                                            Sign in <span aria-hidden="true">→</span>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 max-w-2xl mx-auto">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">500+</div>
                                    <div className="text-sm text-gray-600">Equipment Items</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">15</div>
                                    <div className="text-sm text-gray-600">Laboratories</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">1000+</div>
                                    <div className="text-sm text-gray-600">Active Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">24/7</div>
                                    <div className="text-sm text-gray-600">System Access</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            🌟 Everything you need to manage your lab
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Our comprehensive system handles all aspects of laboratory equipment management with modern UI/UX
                        </p>
                    </div>
                    
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                        {/* Equipment Booking */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="flex flex-col items-center text-center p-8">
                                <div className="mb-4 p-3 bg-blue-100 rounded-full">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Step Booking</h3>
                                <p className="text-gray-600 text-sm">
                                    Stepper-based booking form with JSA upload, date/time selection using Flatpickr, and supervisor selection
                                </p>
                            </CardContent>
                        </Card>

                        {/* Equipment Grid */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="flex flex-col items-center text-center p-8">
                                <div className="mb-4 p-3 bg-green-100 rounded-full">
                                    <span className="text-2xl">🔍</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Equipment Grid</h3>
                                <p className="text-gray-600 text-sm">
                                    Card view with images, color-coded availability, advanced filtering, search, and infinite scroll
                                </p>
                            </CardContent>
                        </Card>

                        {/* Role-Based Dashboards */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="flex flex-col items-center text-center p-8">
                                <div className="mb-4 p-3 bg-purple-100 rounded-full">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Dashboards</h3>
                                <p className="text-gray-600 text-sm">
                                    Customized interfaces for Admin, Kepala Lab, Laboran, Dosen, and Mahasiswa with relevant metrics
                                </p>
                            </CardContent>
                        </Card>

                        {/* Advanced UI/UX */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="flex flex-col items-center text-center p-8">
                                <div className="mb-4 p-3 bg-orange-100 rounded-full">
                                    <span className="text-2xl">✨</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern UI/UX</h3>
                                <p className="text-gray-600 text-sm">
                                    Skeleton loading, shimmer effects, micro-animations, dark mode, and Tailwind CSS components
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* How to Use Flow */}
                <section className="bg-gray-50 py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                🎯 How to Use ChemLab System
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Simple 3-step process to get started with equipment management
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Step 1 */}
                            <Card className="relative hover:shadow-lg transition-shadow">
                                <CardHeader className="text-center pb-4">
                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                        1
                                    </div>
                                    <CardTitle className="text-xl">🔐 Register & Verify</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-gray-600 mb-4">
                                        Create your account and wait for admin verification based on your role (Student, Lab Assistant, or Admin)
                                    </p>
                                    <Badge variant="secondary">Required for all users</Badge>
                                </CardContent>
                            </Card>

                            {/* Step 2 */}
                            <Card className="relative hover:shadow-lg transition-shadow">
                                <CardHeader className="text-center pb-4">
                                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                        2
                                    </div>
                                    <CardTitle className="text-xl">🔍 Browse & Request</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-gray-600 mb-4">
                                        Browse equipment inventory with advanced filters, check availability, and submit loan requests with JSA documents
                                    </p>
                                    <Badge variant="secondary">Multi-step process</Badge>
                                </CardContent>
                            </Card>

                            {/* Step 3 */}
                            <Card className="relative hover:shadow-lg transition-shadow">
                                <CardHeader className="text-center pb-4">
                                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                        3
                                    </div>
                                    <CardTitle className="text-xl">✅ Approve & Track</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-gray-600 mb-4">
                                        Lab assistants review and approve requests. Track your loans, manage returns, and maintain equipment history
                                    </p>
                                    <Badge variant="secondary">Real-time tracking</Badge>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* User Roles Section */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                👥 Built for every lab member
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Specialized dashboards and permissions for different roles in the laboratory ecosystem
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Admin */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardContent className="text-center p-8">
                                    <div className="mb-4">
                                        <span className="text-4xl">👨‍💼</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Admin</h3>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• Student verification management</li>
                                        <li>• Global metrics & analytics</li>
                                        <li>• User management system</li>
                                        <li>• Landing page content control</li>
                                        <li>• Password reset assistance</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Kepala Lab */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardContent className="text-center p-8">
                                    <div className="mb-4">
                                        <span className="text-4xl">👨‍🔬</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Kepala Lab</h3>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• Laboratory status overview</li>
                                        <li>• Pending approval management</li>
                                        <li>• Equipment utilization metrics</li>
                                        <li>• Maintenance status tracking</li>
                                        <li>• Lab profile management</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Laboran */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardContent className="text-center p-8">
                                    <div className="mb-4">
                                        <span className="text-4xl">🔧</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Laboran</h3>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• Process pending requests</li>
                                        <li>• Today's schedule management</li>
                                        <li>• Stock & availability control</li>
                                        <li>• Maintenance task tracking</li>
                                        <li>• Equipment condition updates</li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Students & Researchers */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardContent className="text-center p-8">
                                    <div className="mb-4">
                                        <span className="text-4xl">👩‍🎓</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Dosen & Mahasiswa</h3>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• Browse equipment catalog</li>
                                        <li>• Submit loan requests</li>
                                        <li>• Track loan history & status</li>
                                        <li>• View upcoming schedules</li>
                                        <li>• Manage borrowed items</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="bg-gray-50 py-24">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                🤔 Frequently Asked Questions
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Everything you need to know about using ChemLab Deptekim
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <Card key={index} className="hover:shadow-md transition-shadow">
                                    <Collapsible
                                        open={openFaq === index}
                                        onOpenChange={(isOpen) => setOpenFaq(isOpen ? index : null)}
                                    >
                                        <CollapsibleTrigger className="w-full">
                                            <CardHeader className="text-left hover:bg-gray-50 transition-colors">
                                                <CardTitle className="text-lg flex items-center justify-between">
                                                    {faq.question}
                                                    <span className="text-xl">
                                                        {openFaq === index ? '−' : '+'}
                                                    </span>
                                                </CardTitle>
                                            </CardHeader>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent>
                                                <p className="text-gray-600">{faq.answer}</p>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SOP Documents Section */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                📚 Standard Operating Procedures
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Essential safety and operational guidelines for laboratory use
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                            {sampleSOPs.map((sop, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-2">{sop.title}</CardTitle>
                                                <CardDescription>{sop.description}</CardDescription>
                                            </div>
                                            <Badge variant="outline" className="ml-2">
                                                {sop.laboratory}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="outline" size="sm" className="w-full">
                                            📄 Download PDF
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        
                        <div className="text-center mt-8">
                            <Button variant="outline" size="lg">
                                📚 View All SOPs
                            </Button>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                🚀 Ready to modernize your lab management?
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                                Join the Department of Chemical Engineering, FTUI in creating a more efficient and safer laboratory environment.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                {auth.user ? (
                                    <Link href="/dashboard">
                                        <Button size="lg" variant="secondary" className="px-8 py-3 shadow-lg hover:shadow-xl transition-all">
                                            Access Dashboard 📊
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/register">
                                            <Button size="lg" variant="secondary" className="px-8 py-3 shadow-lg hover:shadow-xl transition-all">
                                                Create Account 🎯
                                            </Button>
                                        </Link>
                                        <Link
                                            href="/login"
                                            className="text-lg font-semibold leading-6 text-white hover:text-blue-100 transition-colors"
                                        >
                                            Sign in <span aria-hidden="true">→</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white border-t py-12">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                            {/* Logo & Description */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">🧪</span>
                                    </div>
                                    <span className="text-lg font-semibold text-gray-900">ChemLab Deptekim</span>
                                </div>
                                <p className="text-gray-600 mb-4 max-w-md">
                                    Advanced laboratory equipment management system for the Department of Chemical Engineering, 
                                    Faculty of Engineering, Universitas Indonesia.
                                </p>
                                <div className="text-sm text-gray-500">
                                    <p>Depok Campus, West Java 16424</p>
                                    <p>Email: chemlab@eng.ui.ac.id</p>
                                    <p>Phone: +62-21-7270032</p>
                                </div>
                            </div>

                            {/* Department Contact */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">🏢 Department Contact</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>Office Hours: Mon-Fri 08:00-16:00</li>
                                    <li>Lab Access: Mon-Sat 08:00-20:00</li>
                                    <li>Emergency: +62-21-7270032 ext. 911</li>
                                    <li>IT Support: support@chemlab.ui.ac.id</li>
                                </ul>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">🔗 Help & Support</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li><a href="#" className="hover:text-blue-600 transition-colors">User Manual</a></li>
                                    <li><a href="#" className="hover:text-blue-600 transition-colors">Safety Guidelines</a></li>
                                    <li><a href="#" className="hover:text-blue-600 transition-colors">Equipment Catalog</a></li>
                                    <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <Separator className="my-8" />
                        
                        <div className="flex flex-col sm:flex-row justify-between items-center">
                            <p className="text-sm text-gray-500">
                                © 2024 ChemLab Deptekim. Laboratory Equipment Management System. All rights reserved.
                            </p>
                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                <Badge variant="outline">v2.0</Badge>
                                <span className="text-xs text-gray-400">Built with ❤️ for FTUI</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}