import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface Laboratory {
    id: number;
    name: string;
    code: string;
    description?: string;
    location: string;
    capacity: number;
    operational_hours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    contact_info: {
        phone?: string;
        email?: string;
        extension?: string;
    };
    head_of_lab?: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
    technicians: {
        id: number;
        name: string;
        email: string;
        role: string;
        phone?: string;
    }[];
    equipment_count: number;
    active_loans: number;
    total_users: number;
    safety_rating: number;
}

interface Equipment {
    id: number;
    name: string;
    code: string;
    condition: string;
    available_quantity: number;
    total_quantity: number;
    category?: string;
}

interface SOPDocument {
    id: number;
    title: string;
    description: string;
    file_url: string;
    category: string;
    version: string;
    last_updated: string;
    file_size: number;
}

interface GalleryImage {
    id: number;
    url: string;
    caption: string;
    uploaded_at: string;
}

interface LabProfileProps {
    laboratory: Laboratory;
    equipment: Equipment[];
    sopDocuments: SOPDocument[];
    gallery: GalleryImage[];
    rules: {
        safety_rules: string[];
        usage_rules: string[];
        booking_rules: string[];
        emergency_procedures: string[];
    };
}

export function LabProfile({ laboratory, equipment, sopDocuments, gallery, rules }: LabProfileProps) {
    const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
    const [imageLoading, setImageLoading] = useState<Set<number>>(new Set());

    const handleImageError = (imageId: number) => {
        setImageLoadErrors(prev => new Set([...prev, imageId]));
        setImageLoading(prev => {
            const newSet = new Set(prev);
            newSet.delete(imageId);
            return newSet;
        });
    };

    const handleImageLoad = (imageId: number) => {
        setImageLoading(prev => {
            const newSet = new Set(prev);
            newSet.delete(imageId);
            return newSet;
        });
    };

    const handleImageLoadStart = (imageId: number) => {
        setImageLoading(prev => new Set([...prev, imageId]));
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

    const getSafetyRatingColor = (rating: number) => {
        if (rating >= 4.5) return 'text-green-600';
        if (rating >= 3.5) return 'text-yellow-600';
        return 'text-red-600';
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-8">
            {/* Lab Header */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                                    <span className="text-3xl">🧪</span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">{laboratory.name}</h1>
                                    <p className="text-blue-100">Code: {laboratory.code}</p>
                                </div>
                            </div>
                            
                            {laboratory.description && (
                                <p className="text-blue-100 mb-4 max-w-2xl">
                                    {laboratory.description}
                                </p>
                            )}
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-blue-100 text-sm">Location</p>
                                    <p className="font-semibold">📍 {laboratory.location}</p>
                                </div>
                                <div>
                                    <p className="text-blue-100 text-sm">Capacity</p>
                                    <p className="font-semibold">👥 {laboratory.capacity} people</p>
                                </div>
                                <div>
                                    <p className="text-blue-100 text-sm">Equipment</p>
                                    <p className="font-semibold">🔬 {laboratory.equipment_count} items</p>
                                </div>
                                <div>
                                    <p className="text-blue-100 text-sm">Safety Rating</p>
                                    <p className={`font-semibold ${getSafetyRatingColor(laboratory.safety_rating)}`}>
                                        ⭐ {laboratory.safety_rating}/5.0
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                            <Badge className="bg-green-100 text-green-800">
                                {laboratory.active_loans} Active Loans
                            </Badge>
                            <Badge className="bg-purple-100 text-purple-800">
                                {laboratory.total_users} Users
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="overview">📋 Overview</TabsTrigger>
                    <TabsTrigger value="equipment">🔬 Equipment</TabsTrigger>
                    <TabsTrigger value="staff">👥 Staff</TabsTrigger>
                    <TabsTrigger value="sop">📚 SOPs</TabsTrigger>
                    <TabsTrigger value="gallery">🖼️ Gallery</TabsTrigger>
                    <TabsTrigger value="rules">📜 Rules</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    📞 Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {laboratory.contact_info.phone && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">📞</span>
                                        <div>
                                            <p className="font-semibold">Phone</p>
                                            <p className="text-gray-600">{laboratory.contact_info.phone}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {laboratory.contact_info.email && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">📧</span>
                                        <div>
                                            <p className="font-semibold">Email</p>
                                            <p className="text-gray-600">{laboratory.contact_info.email}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {laboratory.contact_info.extension && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">📱</span>
                                        <div>
                                            <p className="font-semibold">Extension</p>
                                            <p className="text-gray-600">Ext. {laboratory.contact_info.extension}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">📍</span>
                                    <div>
                                        <p className="font-semibold">Location</p>
                                        <p className="text-gray-600">{laboratory.location}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Operational Hours */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    🕐 Operational Hours
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(laboratory.operational_hours).map(([day, hours]) => (
                                        <div key={day} className="flex justify-between items-center">
                                            <span className="font-medium capitalize">{day}</span>
                                            <span className={`px-2 py-1 rounded text-sm ${
                                                hours === 'Closed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {hours}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Head of Laboratory */}
                    {laboratory.head_of_lab && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    👨‍🔬 Head of Laboratory
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {laboratory.head_of_lab.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{laboratory.head_of_lab.name}</h3>
                                        <p className="text-gray-600">{laboratory.head_of_lab.email}</p>
                                        {laboratory.head_of_lab.phone && (
                                            <p className="text-sm text-gray-500">📞 {laboratory.head_of_lab.phone}</p>
                                        )}
                                    </div>
                                    <Button variant="outline">
                                        📧 Contact
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Equipment Tab */}
                <TabsContent value="equipment" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        🔬 Laboratory Equipment
                                    </CardTitle>
                                    <CardDescription>
                                        {equipment.length} equipment items available
                                    </CardDescription>
                                </div>
                                <Link href={`/equipment?laboratory=${laboratory.id}`}>
                                    <Button variant="outline">View All Equipment</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {equipment.slice(0, 6).map((item) => (
                                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                                                    <p className="text-sm text-gray-600">{item.code}</p>
                                                    {item.category && (
                                                        <Badge variant="outline" className="text-xs mt-1">
                                                            📂 {item.category}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Badge className={getConditionColor(item.condition)}>
                                                    {item.condition}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Available: {item.available_quantity}/{item.total_quantity}
                                                </span>
                                                <Link href={`/equipment/${item.id}`}>
                                                    <Button size="sm" variant="outline">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            
                            {equipment.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔬</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Equipment Available</h3>
                                    <p className="text-gray-600">This laboratory doesn't have any registered equipment yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Staff Tab */}
                <TabsContent value="staff" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                👥 Laboratory Staff
                            </CardTitle>
                            <CardDescription>
                                {laboratory.technicians.length} laboratory technicians
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {laboratory.technicians.map((staff) => (
                                    <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {staff.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{staff.name}</h3>
                                                <p className="text-sm text-gray-600">{staff.email}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {staff.role}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {staff.phone && (
                                                <span className="text-sm text-gray-500">📞 {staff.phone}</span>
                                            )}
                                            <Button variant="outline" size="sm">
                                                📧 Contact
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {laboratory.technicians.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">👥</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Staff Listed</h3>
                                    <p className="text-gray-600">Laboratory staff information is not available.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SOP Documents Tab */}
                <TabsContent value="sop" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📚 Standard Operating Procedures
                            </CardTitle>
                            <CardDescription>
                                {sopDocuments.length} SOP documents available
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sopDocuments.map((sop) => (
                                    <Card key={sop.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 mb-1">{sop.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">{sop.description}</p>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            📂 {sop.category}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            v{sop.version}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        <p>Updated: {new Date(sop.last_updated).toLocaleDateString()}</p>
                                                        <p>Size: {formatFileSize(sop.file_size)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="flex-1">
                                                    👁️ View
                                                </Button>
                                                <Button size="sm" className="flex-1">
                                                    📥 Download
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            
                            {sopDocuments.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📚</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No SOPs Available</h3>
                                    <p className="text-gray-600">Standard operating procedures will be available here.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Gallery Tab */}
                <TabsContent value="gallery" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🖼️ Laboratory Gallery
                            </CardTitle>
                            <CardDescription>
                                {gallery.length} photos available
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {gallery.map((image) => (
                                    <Dialog key={image.id}>
                                        <DialogTrigger asChild>
                                            <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group">
                                                {imageLoading.has(image.id) && (
                                                    <Skeleton className="w-full h-full absolute inset-0" />
                                                )}
                                                
                                                {!imageLoadErrors.has(image.id) ? (
                                                    <img
                                                        src={image.url}
                                                        alt={image.caption}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                        onLoad={() => handleImageLoad(image.id)}
                                                        onError={() => handleImageError(image.id)}
                                                        onLoadStart={() => handleImageLoadStart(image.id)}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                        <span className="text-4xl text-gray-400">🖼️</span>
                                                    </div>
                                                )}
                                                
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                                                    <p className="text-white p-3 text-sm">{image.caption}</p>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl">
                                            <DialogHeader>
                                                <DialogTitle>{image.caption}</DialogTitle>
                                                <DialogDescription>
                                                    Uploaded on {new Date(image.uploaded_at).toLocaleDateString()}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="max-h-[70vh] overflow-hidden rounded-lg">
                                                <img
                                                    src={image.url}
                                                    alt={image.caption}
                                                    className="w-full h-auto"
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ))}
                            </div>
                            
                            {gallery.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🖼️</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Photos Available</h3>
                                    <p className="text-gray-600">Laboratory photos will be displayed here.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Rules Tab */}
                <TabsContent value="rules" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Safety Rules */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    ⚠️ Safety Rules
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {rules.safety_rules.map((rule, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-red-600 mt-1">•</span>
                                            <span className="text-sm">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Usage Rules */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-600">
                                    📋 Usage Rules
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {rules.usage_rules.map((rule, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span className="text-sm">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Booking Rules */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-600">
                                    📅 Booking Rules
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {rules.booking_rules.map((rule, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">•</span>
                                            <span className="text-sm">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Emergency Procedures */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-orange-600">
                                    🚨 Emergency Procedures
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {rules.emergency_procedures.map((rule, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-orange-600 mt-1">•</span>
                                            <span className="text-sm">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}