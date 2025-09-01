import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { EquipmentGrid } from '@/components/equipment-grid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Equipment {
    id: number;
    name: string;
    code: string;
    brand: string;
    model?: string;
    description?: string;
    available_quantity: number;
    total_quantity: number;
    condition: string;
    status: string;
    laboratory: {
        name: string;
        code: string;
    };
    image_url?: string;
    category?: string;
    hazard_class?: string;
    requires_training?: boolean;
}

interface Laboratory {
    id: number;
    name: string;
    code: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    laboratory?: Laboratory;
}

interface Props {
    equipment: {
        data: Equipment[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    laboratories: Laboratory[];
    filters?: {
        search?: string;
        laboratory?: string;
        category?: string;
        condition?: string;
        status?: string;
    };
    stats: {
        total_equipment: number;
        available_equipment: number;
        maintenance_equipment: number;
        categories_count: number;
    };
    [key: string]: unknown;
}

export default function EquipmentIndex({ equipment, laboratories, filters, stats }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;
    
    const canRequest = user.role === 'student' || user.role === 'lecturer';
    const hasMore = equipment.current_page < equipment.last_page;

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Equipment Inventory', href: '/equipment' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Equipment Inventory" />
            
            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            🔬 Equipment Inventory
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Browse and manage laboratory equipment across all departments
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Equipment</p>
                                    <p className="text-3xl font-bold text-blue-600">{stats.total_equipment}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <span className="text-2xl">⚗️</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Available Now</p>
                                    <p className="text-3xl font-bold text-green-600">{stats.available_equipment}</p>
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
                                    <p className="text-sm font-medium text-gray-600">Under Maintenance</p>
                                    <p className="text-3xl font-bold text-yellow-600">{stats.maintenance_equipment}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <span className="text-2xl">🔧</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Categories</p>
                                    <p className="text-3xl font-bold text-purple-600">{stats.categories_count}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <span className="text-2xl">📂</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Equipment Grid */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Equipment Catalog</CardTitle>
                                <CardDescription>
                                    Showing {equipment.data.length} of {equipment.total} items
                                    {filters?.search && ` for "${filters.search}"`}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                    Page {equipment.current_page} of {equipment.last_page}
                                </Badge>
                                {canRequest && (
                                    <Badge className="bg-green-100 text-green-800">
                                        🎯 You can request equipment
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <EquipmentGrid
                            equipment={equipment.data}
                            laboratories={laboratories}
                            filters={filters}
                            canRequest={canRequest}
                            hasMore={hasMore}
                            onLoadMore={() => {
                                // Implement infinite scroll or pagination
                                window.location.href = `${window.location.pathname}?${new URLSearchParams({
                                    ...filters,
                                    page: (equipment.current_page + 1).toString()
                                }).toString()}`;
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Help Section for Students */}
                {canRequest && (
                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                💡 How to Request Equipment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Browse & Filter</p>
                                        <p className="text-gray-600">Use filters to find the equipment you need. Check availability status.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Submit Request</p>
                                        <p className="text-gray-600">Click "Request" and fill out the form with JSA document upload.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">Wait for Approval</p>
                                        <p className="text-gray-600">Lab assistants will review and approve your request.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}