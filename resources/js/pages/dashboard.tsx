import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Equipment {
    id: number;
    name: string;
    code: string;
    brand: string;
    available_quantity: number;
    total_quantity: number;
    condition: string;
    laboratory: {
        name: string;
        code: string;
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
    laboratory?: {
        name: string;
        code: string;
    };
    user?: {
        name: string;
        email: string;
    };
}

interface Laboratory {
    id: number;
    name: string;
    code: string;
    equipment_count: number;
    loan_requests_count: number;
}

interface Stats {
    [key: string]: number;
}

interface Props {
    availableEquipment?: Equipment[];
    myRequests?: LoanRequest[];
    pendingRequests?: LoanRequest[];
    myEquipment?: Equipment[];
    recentRequests?: LoanRequest[];
    laboratories?: Laboratory[];
    stats: Stats;
    laboratory?: Laboratory;
    filters?: {
        search?: string;
    };
    [key: string]: unknown;
}

export default function Dashboard({ 
    availableEquipment, 
    myRequests, 
    pendingRequests, 
    myEquipment,
    recentRequests,
    laboratories,
    stats,
    laboratory,

}: Props) {
    interface User {
        id: number;
        name: string;
        email: string;
        role: string;
        laboratory?: Laboratory;
        laboratory_id?: number;
    }
    
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-blue-100 text-blue-800',
            rejected: 'bg-red-100 text-red-800',
            borrowed: 'bg-green-100 text-green-800',
            returned: 'bg-gray-100 text-gray-800',
            overdue: 'bg-red-100 text-red-800'
        };
        return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
    };

    const getConditionBadge = (condition: string) => {
        const variants = {
            excellent: 'bg-green-100 text-green-800',
            good: 'bg-blue-100 text-blue-800',
            fair: 'bg-yellow-100 text-yellow-800',
            poor: 'bg-red-100 text-red-800'
        };
        return variants[condition as keyof typeof variants] || 'bg-gray-100 text-gray-800';
    };

    const handleEquipmentRequest = (equipmentId: number) => {
        router.get(`/loan-requests/create?equipment_id=${equipmentId}`);
    };

    return (
        <AppShell>
            <Head title="Dashboard" />
            
            <div className="space-y-8">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">
                        Welcome back, {user.name}! 👋
                    </h1>
                    <p className="text-blue-100">
                        {user.role === 'student' && 'Browse available equipment and manage your loan requests'}
                        {user.role === 'lab_assistant' && `Manage ${laboratory?.name || 'your laboratory'} equipment and requests`}
                        {user.role === 'admin' && 'System overview and administration'}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(stats).map(([key, value]) => {
                        const statLabels = {
                            pending_requests: 'Pending Requests',
                            approved_requests: 'Approved Requests', 
                            borrowed_items: 'Borrowed Items',
                            available_equipment: 'Available Equipment',
                            total_equipment: 'Total Equipment',
                            total_users: 'Total Users',
                            total_laboratories: 'Total Laboratories',
                            overdue_items: 'Overdue Items'
                        };
                        
                        const statIcons = {
                            pending_requests: '⏳',
                            approved_requests: '✅',
                            borrowed_items: '📤',
                            available_equipment: '🔬',
                            total_equipment: '⚗️',
                            total_users: '👥',
                            total_laboratories: '🏢',
                            overdue_items: '⚠️'
                        };
                        
                        return (
                            <Card key={key}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                {statLabels[key as keyof typeof statLabels] || key}
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                                        </div>
                                        <span className="text-2xl">
                                            {statIcons[key as keyof typeof statIcons] || '📊'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Student Dashboard */}
                {user.role === 'student' && (
                    <>
                        {/* Available Equipment */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>🔬 Available Equipment</CardTitle>
                                        <CardDescription>
                                            Browse and request laboratory equipment
                                        </CardDescription>
                                    </div>
                                    <Link href="/equipment">
                                        <Button variant="outline">View All</Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {availableEquipment?.map((equipment) => (
                                        <div key={equipment.id} className="border rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">{equipment.name}</h3>
                                                    <p className="text-sm text-gray-600">{equipment.code}</p>
                                                    <p className="text-xs text-gray-500">{equipment.brand}</p>
                                                </div>
                                                <Badge className={getConditionBadge(equipment.condition)}>
                                                    {equipment.condition}
                                                </Badge>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm text-gray-600">
                                                    Available: {equipment.available_quantity}/{equipment.total_quantity}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {equipment.laboratory.name}
                                                </span>
                                            </div>
                                            
                                            <Button 
                                                size="sm" 
                                                className="w-full"
                                                disabled={equipment.available_quantity === 0}
                                                onClick={() => handleEquipmentRequest(equipment.id)}
                                            >
                                                {equipment.available_quantity > 0 ? 'Request Equipment' : 'Out of Stock'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                
                                {(!availableEquipment || availableEquipment.length === 0) && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No equipment available at the moment</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* My Recent Requests */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>📋 My Recent Requests</CardTitle>
                                        <CardDescription>
                                            Your latest loan requests
                                        </CardDescription>
                                    </div>
                                    <Link href="/loan-requests">
                                        <Button variant="outline">View All</Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {myRequests?.map((request) => (
                                        <div key={request.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h3 className="font-semibold">{request.equipment.name}</h3>
                                                    <p className="text-sm text-gray-600">Request #{request.request_number}</p>
                                                </div>
                                                <Badge className={getStatusBadge(request.status)}>
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
                                
                                {(!myRequests || myRequests.length === 0) && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No requests found</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Lab Assistant Dashboard */}
                {user.role === 'lab_assistant' && (
                    <>
                        {/* Pending Requests */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>⏳ Pending Requests</CardTitle>
                                        <CardDescription>
                                            Requests awaiting your approval
                                        </CardDescription>
                                    </div>
                                    <Link href="/loan-requests">
                                        <Button variant="outline">View All</Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {pendingRequests?.map((request) => (
                                        <div key={request.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h3 className="font-semibold">{request.equipment.name}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        Requested by: {request.user?.name}
                                                    </p>
                                                </div>
                                                <Badge className={getStatusBadge(request.status)}>
                                                    {request.status}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-3">
                                                Quantity: {request.quantity_requested} | 
                                                Period: {new Date(request.requested_start_date).toLocaleDateString()} - {new Date(request.requested_end_date).toLocaleDateString()}
                                            </div>
                                            <Link href={`/loan-requests/${request.id}`}>
                                                <Button size="sm">Review Request</Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                                
                                {(!pendingRequests || pendingRequests.length === 0) && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No pending requests</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* My Laboratory Equipment */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>⚗️ Laboratory Equipment</CardTitle>
                                        <CardDescription>
                                            Equipment in {laboratory?.name || 'your laboratory'}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href="/equipment/create">
                                            <Button size="sm">Add Equipment</Button>
                                        </Link>
                                        <Link href="/equipment">
                                            <Button variant="outline" size="sm">View All</Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {myEquipment?.map((equipment) => (
                                        <div key={equipment.id} className="border rounded-lg p-4">
                                            <h3 className="font-semibold mb-1">{equipment.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{equipment.code}</p>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm">
                                                    {equipment.available_quantity}/{equipment.total_quantity}
                                                </span>
                                                <Badge className={getConditionBadge(equipment.condition)}>
                                                    {equipment.condition}
                                                </Badge>
                                            </div>
                                            <Link href={`/equipment/${equipment.id}`}>
                                                <Button size="sm" variant="outline" className="w-full">
                                                    Manage
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                                
                                {(!myEquipment || myEquipment.length === 0) && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No equipment found</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Admin Dashboard */}
                {user.role === 'admin' && (
                    <>
                        {/* Recent Requests */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>📋 Recent Requests</CardTitle>
                                        <CardDescription>
                                            Latest loan requests across all laboratories
                                        </CardDescription>
                                    </div>
                                    <Link href="/loan-requests">
                                        <Button variant="outline">View All</Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentRequests?.map((request) => (
                                        <div key={request.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h3 className="font-semibold">{request.equipment.name}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {request.user?.name} • {request.laboratory?.name}
                                                    </p>
                                                </div>
                                                <Badge className={getStatusBadge(request.status)}>
                                                    {request.status}
                                                </Badge>
                                            </div>
                                            <Link href={`/loan-requests/${request.id}`}>
                                                <Button size="sm" variant="outline">View Details</Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                                
                                {(!recentRequests || recentRequests.length === 0) && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No recent requests</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Laboratories Overview */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>🏢 Laboratories</CardTitle>
                                        <CardDescription>
                                            Overview of all laboratories
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href="/laboratories/create">
                                            <Button size="sm">Add Laboratory</Button>
                                        </Link>
                                        <Link href="/laboratories">
                                            <Button variant="outline" size="sm">View All</Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {laboratories?.map((lab) => (
                                        <div key={lab.id} className="border rounded-lg p-4">
                                            <h3 className="font-semibold mb-1">{lab.name}</h3>
                                            <p className="text-sm text-gray-600 mb-3">{lab.code}</p>
                                            <div className="text-sm text-gray-600 mb-3">
                                                <div>Equipment: {lab.equipment_count}</div>
                                                <div>Requests: {lab.loan_requests_count}</div>
                                            </div>
                                            <Link href={`/laboratories/${lab.id}`}>
                                                <Button size="sm" variant="outline" className="w-full">
                                                    Manage
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                                
                                {(!laboratories || laboratories.length === 0) && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No laboratories found</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </AppShell>
    );
}