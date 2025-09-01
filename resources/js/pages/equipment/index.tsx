import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Equipment {
    id: number;
    name: string;
    code: string;
    brand: string;
    model: string;
    total_quantity: number;
    available_quantity: number;
    condition: string;
    status: string;
    laboratory: {
        name: string;
        code: string;
    };
}

interface Laboratory {
    id: number;
    name: string;
    code: string;
}

interface Props {
    equipment: {
        data: Equipment[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
    };
    laboratories: Laboratory[];
    filters: {
        search?: string;
        status?: string;
        laboratory_id?: string;
    };
    [key: string]: unknown;
}

export default function EquipmentIndex({ equipment, laboratories, filters }: Props) {
    interface User {
        id: number;
        name: string;
        email: string;
        role: string;
    }
    
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    const getStatusBadge = (status: string) => {
        const variants = {
            active: 'bg-green-100 text-green-800',
            maintenance: 'bg-yellow-100 text-yellow-800',
            retired: 'bg-red-100 text-red-800'
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

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        const status = formData.get('status') as string;
        const laboratory_id = formData.get('laboratory_id') as string;
        
        router.get('/equipment', {
            search: search || undefined,
            status: status || undefined,
            laboratory_id: laboratory_id || undefined,
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleEquipmentRequest = (equipmentId: number) => {
        router.get(`/loan-requests/create?equipment_id=${equipmentId}`);
    };

    return (
        <AppShell>
            <Head title="Equipment" />
            
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">🔬 Laboratory Equipment</h1>
                        <p className="text-gray-600">
                            {user.role === 'student' && 'Browse and request available equipment'}
                            {user.role === 'lab_assistant' && 'Manage your laboratory equipment'}
                            {user.role === 'admin' && 'System-wide equipment management'}
                        </p>
                    </div>
                    
                    {(user.role === 'lab_assistant' || user.role === 'admin') && (
                        <Link href="/equipment/create">
                            <Button>Add Equipment</Button>
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={filters.search || ''}
                                    placeholder="Equipment name, code, or brand..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    defaultValue={filters.status || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="retired">Retired</option>
                                </select>
                            </div>
                            
                            {user.role === 'admin' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Laboratory
                                    </label>
                                    <select
                                        name="laboratory_id"
                                        defaultValue={filters.laboratory_id || ''}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Laboratories</option>
                                        {laboratories.map((lab) => (
                                            <option key={lab.id} value={lab.id}>
                                                {lab.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            
                            <div className="flex items-end">
                                <Button type="submit" className="w-full">
                                    Apply Filters
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Equipment Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {equipment.data.map((item) => (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                                        <p className="text-sm text-gray-600">{item.code}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.brand} {item.model && `• ${item.model}`}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Badge className={getStatusBadge(item.status)}>
                                            {item.status}
                                        </Badge>
                                        <Badge className={getConditionBadge(item.condition)}>
                                            {item.condition}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Available</span>
                                        <span className="font-medium">
                                            {item.available_quantity}/{item.total_quantity}
                                        </span>
                                    </div>
                                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full" 
                                            style={{ 
                                                width: `${(item.available_quantity / item.total_quantity) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div className="text-xs text-gray-500 mb-3">
                                    📍 {item.laboratory.name}
                                </div>
                                
                                <div className="flex gap-2">
                                    <Link href={`/equipment/${item.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            View Details
                                        </Button>
                                    </Link>
                                    
                                    {user.role === 'student' && item.status === 'active' && item.available_quantity > 0 && (
                                        <Button 
                                            size="sm" 
                                            className="flex-1"
                                            onClick={() => handleEquipmentRequest(item.id)}
                                        >
                                            Request
                                        </Button>
                                    )}
                                    
                                    {(user.role === 'lab_assistant' || user.role === 'admin') && (
                                        <Link href={`/equipment/${item.id}/edit`} className="flex-1">
                                            <Button size="sm" variant="outline" className="w-full">
                                                Edit
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {equipment.data.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔬</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
                        <p className="text-gray-600 mb-4">
                            {Object.keys(filters).some(key => filters[key as keyof typeof filters]) 
                                ? 'Try adjusting your filters to see more results.'
                                : 'No equipment has been added yet.'}
                        </p>
                        {(user.role === 'lab_assistant' || user.role === 'admin') && (
                            <Link href="/equipment/create">
                                <Button>Add First Equipment</Button>
                            </Link>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {equipment.last_page > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        {equipment.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                className={`px-3 py-2 text-sm rounded-md ${
                                    link.active
                                        ? 'bg-blue-500 text-white'
                                        : link.url
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : 'text-gray-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}