import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Equipment {
    id: number;
    name: string;
    code: string;
    available_quantity: number;
    total_quantity: number;
    condition: string;
    laboratory: {
        name: string;
    };
}

interface LoanRequest {
    id: number;
    request_number: string;
    status: string;
    quantity_requested: number;
    requested_start_date: string;
    requested_end_date: string;
    equipment: {
        name: string;
        code: string;
    };
    user?: {
        name: string;
    };
    laboratory?: {
        name: string;
    };
}

interface Laboratory {
    id: number;
    name: string;
    code: string;
    equipment_count: number;
    loan_requests_count: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    laboratory?: Laboratory;
}

interface DashboardStats {
    [key: string]: number;
}

// Admin Dashboard Component
interface AdminDashboardProps {
    stats: DashboardStats;
    recentRequests: LoanRequest[];
    laboratories: Laboratory[];
    pendingVerifications: User[];
}

export function AdminDashboard({ stats, recentRequests, laboratories, pendingVerifications }: AdminDashboardProps) {
    return (
        <div className="space-y-8">
            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.total_users}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <span className="text-2xl">👥</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pending_verifications}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Equipment</p>
                                <p className="text-3xl font-bold text-green-600">{stats.total_equipment}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <span className="text-2xl">⚗️</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.active_loans}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <span className="text-2xl">📤</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🚀 Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/users">
                            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                                <span className="text-2xl">👥</span>
                                <span>Manage Users</span>
                            </Button>
                        </Link>
                        <Link href="/password-reset-requests">
                            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                                <span className="text-2xl">🔑</span>
                                <span>Password Resets</span>
                            </Button>
                        </Link>
                        <Link href="/laboratories">
                            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                                <span className="text-2xl">🏢</span>
                                <span>Laboratories</span>
                            </Button>
                        </Link>
                        <Link href="/equipment">
                            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                                <span className="text-2xl">🔬</span>
                                <span>Equipment</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Student Verification Queue */}
            {pendingVerifications.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    ⏳ Student Verification Queue
                                </CardTitle>
                                <CardDescription>
                                    New users awaiting verification
                                </CardDescription>
                            </div>
                            <Badge variant="destructive">
                                {pendingVerifications.length} pending
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pendingVerifications.slice(0, 5).map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        <Badge variant="outline" className="text-xs">
                                            {user.role}
                                        </Badge>
                                    </div>
                                    <Link href={`/users/${user.id}`}>
                                        <Button size="sm">Review</Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        {pendingVerifications.length > 5 && (
                            <div className="text-center mt-4">
                                <Link href="/users?status=pending">
                                    <Button variant="outline">
                                        View All {pendingVerifications.length} Pending
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* System Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            📊 Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentRequests.map((request) => (
                                <div key={request.id} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{request.equipment.name}</p>
                                        <p className="text-xs text-gray-600">
                                            {request.user?.name} • {request.laboratory?.name}
                                        </p>
                                    </div>
                                    <Badge className={request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                                        {request.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Laboratory Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🏢 Laboratory Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {laboratories.slice(0, 5).map((lab) => (
                                <div key={lab.id} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-sm">{lab.name}</span>
                                        <span className="text-xs text-gray-500">
                                            {lab.equipment_count} equipment
                                        </span>
                                    </div>
                                    <Progress value={(lab.equipment_count / 50) * 100} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Lab Assistant Dashboard Component
interface LabAssistantDashboardProps {
    stats: DashboardStats;
    pendingRequests: LoanRequest[];
    myEquipment: Equipment[];
    todaySchedule: LoanRequest[];
    laboratory: Laboratory;
}

export function LabAssistantDashboard({ stats, pendingRequests, myEquipment, todaySchedule, laboratory }: LabAssistantDashboardProps) {
    return (
        <div className="space-y-8">
            {/* Lab Status Overview */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-2">🏢 {laboratory.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <p className="text-blue-100">Equipment</p>
                            <p className="text-2xl font-bold">{stats.lab_equipment}</p>
                        </div>
                        <div>
                            <p className="text-blue-100">Pending Requests</p>
                            <p className="text-2xl font-bold">{stats.pending_requests}</p>
                        </div>
                        <div>
                            <p className="text-blue-100">Active Loans</p>
                            <p className="text-2xl font-bold">{stats.active_loans}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            📅 Today's Schedule
                        </CardTitle>
                        <Badge variant="outline">
                            {todaySchedule.length} activities
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {todaySchedule.length > 0 ? (
                        <div className="space-y-3">
                            {todaySchedule.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-semibold">{item.equipment.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {item.user?.name} • {new Date(item.requested_start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-800">
                                        {item.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <span className="text-4xl mb-2 block">📅</span>
                            <p>No scheduled activities for today</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            ⏳ Pending Approvals
                        </CardTitle>
                        <Badge variant="destructive">
                            {pendingRequests.length} pending
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {pendingRequests.length > 0 ? (
                        <div className="space-y-4">
                            {pendingRequests.map((request) => (
                                <div key={request.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold">{request.equipment.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                Requested by: {request.user?.name}
                                            </p>
                                        </div>
                                        <Badge className="bg-yellow-100 text-yellow-800">
                                            {request.status}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        Quantity: {request.quantity_requested} | 
                                        Period: {new Date(request.requested_start_date).toLocaleDateString()} - {new Date(request.requested_end_date).toLocaleDateString()}
                                    </div>
                                    <Link href={`/loan-requests/${request.id}`}>
                                        <Button size="sm">📋 Review Request</Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <span className="text-4xl mb-2 block">✅</span>
                            <p>No pending requests</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Equipment Status */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            🔬 Equipment Status
                        </CardTitle>
                        <Link href="/equipment">
                            <Button variant="outline" size="sm">Manage All</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myEquipment.slice(0, 6).map((equipment) => (
                            <div key={equipment.id} className="border rounded-lg p-3">
                                <h3 className="font-semibold mb-1">{equipment.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{equipment.code}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">
                                        {equipment.available_quantity}/{equipment.total_quantity} available
                                    </span>
                                    <Badge className={equipment.condition === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                        {equipment.condition}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Student Dashboard Component
interface StudentDashboardProps {
    stats: DashboardStats;
    availableEquipment: Equipment[];
    myRequests: LoanRequest[];
    upcomingSchedule: LoanRequest[];
}

export function StudentDashboard({ stats, availableEquipment, myRequests, upcomingSchedule }: StudentDashboardProps) {
    return (
        <div className="space-y-8">
            {/* Student Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">My Requests</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.my_requests}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <span className="text-2xl">📋</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Borrowed Items</p>
                                <p className="text-3xl font-bold text-green-600">{stats.borrowed_items}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <span className="text-2xl">📤</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pending_approvals}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Available Now</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.available_equipment}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <span className="text-2xl">🔬</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Equipment Browse */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            🔬 Available Equipment
                        </CardTitle>
                        <Link href="/equipment">
                            <Button variant="outline">Browse All</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableEquipment.slice(0, 6).map((equipment) => (
                            <div key={equipment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{equipment.name}</h3>
                                        <p className="text-sm text-gray-600">{equipment.code}</p>
                                        <p className="text-xs text-gray-500">{equipment.laboratory.name}</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800">
                                        {equipment.available_quantity} available
                                    </Badge>
                                </div>
                                <Link href={`/loan-requests/create?equipment_id=${equipment.id}`}>
                                    <Button size="sm" className="w-full">
                                        📋 Request Equipment
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* My Requests */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            📋 My Recent Requests
                        </CardTitle>
                        <Link href="/loan-requests">
                            <Button variant="outline">View All</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {myRequests.length > 0 ? (
                        <div className="space-y-4">
                            {myRequests.slice(0, 5).map((request) => (
                                <div key={request.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold">{request.equipment.name}</h3>
                                            <p className="text-sm text-gray-600">Request #{request.request_number}</p>
                                        </div>
                                        <Badge className={
                                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }>
                                            {request.status}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Quantity: {request.quantity_requested} | 
                                        Period: {new Date(request.requested_start_date).toLocaleDateString()} - {new Date(request.requested_end_date).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <span className="text-4xl mb-2 block">📋</span>
                            <p>No requests yet</p>
                            <Link href="/equipment">
                                <Button className="mt-2">Browse Equipment</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upcoming Schedule */}
            {upcomingSchedule.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            📅 Upcoming Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcomingSchedule.map((schedule) => (
                                <div key={schedule.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold">{schedule.equipment.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(schedule.requested_start_date).toLocaleDateString()} - {new Date(schedule.requested_end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-800">
                                        {schedule.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}