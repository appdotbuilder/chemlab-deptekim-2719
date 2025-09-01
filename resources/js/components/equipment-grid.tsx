import React, { useState, useCallback, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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

interface EquipmentGridProps {
    equipment: Equipment[];
    laboratories: Laboratory[];
    filters?: {
        search?: string;
        laboratory?: string;
        category?: string;
        condition?: string;
        status?: string;
    };
    isLoading?: boolean;
    canRequest?: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
}

export function EquipmentGrid({
    equipment,
    laboratories,
    filters,
    isLoading = false,
    canRequest = false,
    onLoadMore,
    hasMore = false
}: EquipmentGridProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [selectedLab, setSelectedLab] = useState(filters?.laboratory || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
    const [selectedCondition, setSelectedCondition] = useState(filters?.condition || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    const [imageLoading, setImageLoading] = useState<Set<number>>(new Set());

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== filters?.search) {
                router.get(window.location.pathname, {
                    search: searchQuery || undefined,
                    laboratory: selectedLab || undefined,
                    category: selectedCategory || undefined,
                    condition: selectedCondition || undefined,
                    status: selectedStatus || undefined,
                }, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedLab, selectedCategory, selectedCondition, selectedStatus, filters]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getConditionColor = (condition: string) => {
        switch (condition.toLowerCase()) {
            case 'excellent': return 'bg-green-100 text-green-800';
            case 'good': return 'bg-blue-100 text-blue-800';
            case 'fair': return 'bg-yellow-100 text-yellow-800';
            case 'poor': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getAvailabilityColor = (available: number, total: number) => {
        const percentage = (available / total) * 100;
        if (percentage === 0) return 'bg-red-100 text-red-800';
        if (percentage <= 25) return 'bg-orange-100 text-orange-800';
        if (percentage <= 50) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const handleImageLoad = useCallback((equipmentId: number) => {
        setImageLoading(prev => {
            const newSet = new Set(prev);
            newSet.delete(equipmentId);
            return newSet;
        });
    }, []);

    const handleImageError = useCallback((equipmentId: number) => {
        setImageErrors(prev => new Set([...prev, equipmentId]));
        setImageLoading(prev => {
            const newSet = new Set(prev);
            newSet.delete(equipmentId);
            return newSet;
        });
    }, []);

    const handleImageLoadStart = useCallback((equipmentId: number) => {
        setImageLoading(prev => new Set([...prev, equipmentId]));
    }, []);

    const handleRequest = (equipmentId: number) => {
        router.get(`/loan-requests/create?equipment_id=${equipmentId}`);
    };

    const categories = [...new Set(equipment.map(eq => eq.category).filter(Boolean))];

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <Input
                                placeholder="🔍 Search equipment..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Laboratory Filter */}
                        <Select value={selectedLab} onValueChange={setSelectedLab}>
                            <SelectTrigger>
                                <SelectValue placeholder="🏢 All Labs" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Laboratories</SelectItem>
                                {laboratories.map((lab) => (
                                    <SelectItem key={lab.id} value={lab.id.toString()}>
                                        {lab.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Category Filter */}
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="📂 Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category || ''}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Condition Filter */}
                        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                            <SelectTrigger>
                                <SelectValue placeholder="⚡ Condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Conditions</SelectItem>
                                <SelectItem value="excellent">Excellent</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="poor">Poor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {equipment.map((item) => (
                    <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-0">
                            {/* Equipment Image */}
                            <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                                {imageLoading.has(item.id) && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Skeleton className="w-full h-full" />
                                    </div>
                                )}
                                
                                {!imageErrors.has(item.id) && item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onLoad={() => handleImageLoad(item.id)}
                                        onError={() => handleImageError(item.id)}
                                        onLoadStart={() => handleImageLoadStart(item.id)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                        <span className="text-4xl text-gray-400">🔬</span>
                                    </div>
                                )}

                                {/* Status and Condition Badges */}
                                <div className="absolute top-2 right-2 flex flex-col gap-1">
                                    <Badge className={getStatusColor(item.status)}>
                                        {item.status}
                                    </Badge>
                                    <Badge className={getConditionColor(item.condition)}>
                                        {item.condition}
                                    </Badge>
                                </div>

                                {/* Availability Badge */}
                                <div className="absolute top-2 left-2">
                                    <Badge className={getAvailabilityColor(item.available_quantity, item.total_quantity)}>
                                        {item.available_quantity}/{item.total_quantity}
                                    </Badge>
                                </div>

                                {/* Training Required Badge */}
                                {item.requires_training && (
                                    <div className="absolute bottom-2 left-2">
                                        <Badge variant="outline" className="bg-white/90">
                                            🎓 Training Required
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Equipment Details */}
                            <div className="p-4">
                                <div className="mb-3">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Code: {item.code}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {item.brand} {item.model && `• ${item.model}`}
                                    </p>
                                </div>

                                {/* Laboratory */}
                                <div className="mb-3">
                                    <Badge variant="outline" className="text-xs">
                                        🏢 {item.laboratory.name}
                                    </Badge>
                                </div>

                                {/* Category and Hazard */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {item.category && (
                                        <Badge variant="outline" className="text-xs">
                                            📂 {item.category}
                                        </Badge>
                                    )}
                                    {item.hazard_class && (
                                        <Badge variant="destructive" className="text-xs">
                                            ⚠️ {item.hazard_class}
                                        </Badge>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {/* Quick View */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="flex-1">
                                                👁️ View
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>{item.name}</DialogTitle>
                                                <DialogDescription>
                                                    Complete equipment specifications
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Image */}
                                                <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                                                    {!imageErrors.has(item.id) && item.image_url ? (
                                                        <img
                                                            src={item.image_url}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                            <span className="text-6xl text-gray-400">🔬</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Details */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Basic Information</h4>
                                                        <div className="space-y-1 text-sm">
                                                            <p><strong>Code:</strong> {item.code}</p>
                                                            <p><strong>Brand:</strong> {item.brand}</p>
                                                            {item.model && <p><strong>Model:</strong> {item.model}</p>}
                                                            <p><strong>Laboratory:</strong> {item.laboratory.name}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Status & Availability</h4>
                                                        <div className="space-y-2">
                                                            <div className="flex gap-2">
                                                                <Badge className={getStatusColor(item.status)}>
                                                                    {item.status}
                                                                </Badge>
                                                                <Badge className={getConditionColor(item.condition)}>
                                                                    {item.condition}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm">
                                                                Available: {item.available_quantity} of {item.total_quantity} units
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {item.description && (
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Description</h4>
                                                            <p className="text-sm text-gray-600">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {canRequest && item.available_quantity > 0 && (
                                                        <Button
                                                            onClick={() => handleRequest(item.id)}
                                                            className="w-full"
                                                        >
                                                            📋 Request Equipment
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Request Button */}
                                    {canRequest && (
                                        <Button
                                            size="sm"
                                            disabled={item.available_quantity === 0}
                                            onClick={() => handleRequest(item.id)}
                                            className="flex-1"
                                        >
                                            {item.available_quantity > 0 ? '📋 Request' : '❌ Unavailable'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Loading Skeletons */}
                {isLoading && (
                    <>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <Card key={`skeleton-${index}`}>
                                <CardContent className="p-0">
                                    <Skeleton className="h-48 rounded-t-lg" />
                                    <div className="p-4 space-y-3">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-1/3" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 flex-1" />
                                            <Skeleton className="h-8 flex-1" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </>
                )}
            </div>

            {/* Empty State */}
            {!isLoading && equipment.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No equipment found</h3>
                    <p className="text-gray-600 mb-4">
                        Try adjusting your search criteria or browse different categories.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedLab('');
                            setSelectedCategory('');
                            setSelectedCondition('');
                            setSelectedStatus('');
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            )}

            {/* Load More Button */}
            {hasMore && onLoadMore && (
                <div className="text-center pt-6">
                    <Button
                        variant="outline"
                        onClick={onLoadMore}
                        disabled={isLoading}
                        size="lg"
                    >
                        {isLoading ? '⏳ Loading...' : '📄 Load More Equipment'}
                    </Button>
                </div>
            )}
        </div>
    );
}