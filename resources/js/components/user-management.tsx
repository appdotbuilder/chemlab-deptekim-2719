import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    laboratory?: {
        id: number;
        name: string;
        code: string;
    };
    created_at: string;
    last_login?: string;
    email_verified_at?: string;
}

interface Laboratory {
    id: number;
    name: string;
    code: string;
}

interface UserManagementProps {
    users: {
        admins: User[];
        lab_staff: User[];
        lecturers: User[];
        students: User[];
    };
    laboratories: Laboratory[];
    filters?: {
        search?: string;
        status?: string;
        laboratory?: string;
        role?: string;
    };
    stats: {
        total_users: number;
        active_users: number;
        pending_users: number;
        verified_users: number;
    };
}

export function UserManagement({ users, laboratories, filters, stats }: UserManagementProps) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState('admins');

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin': return '👨‍💼';
            case 'lab_head': return '👨‍🔬';
            case 'lab_assistant': return '🔧';
            case 'lecturer': return '👨‍🏫';
            case 'student': return '👩‍🎓';
            default: return '👤';
        }
    };

    const handleBulkAction = (action: string) => {
        if (selectedUsers.length === 0) return;
        
        router.post(route('users.bulk-action'), {
            action,
            user_ids: selectedUsers
        });
    };

    const handleSelectUser = (userId: number, checked: boolean) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    const handleSelectAll = (userList: User[], checked: boolean) => {
        if (checked) {
            const userIds = userList.map(user => user.id);
            setSelectedUsers([...selectedUsers, ...userIds]);
        } else {
            const userIds = userList.map(user => user.id);
            setSelectedUsers(selectedUsers.filter(id => !userIds.includes(id)));
        }
    };

    const renderUserTable = (userList: User[], roleType: string) => (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            {getRoleIcon(roleType)} {roleType.replace('_', ' ').toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                            {userList.length} users
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedUsers.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    {selectedUsers.length} selected
                                </span>
                                <Select onValueChange={handleBulkAction}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Actions" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="activate">✅ Activate</SelectItem>
                                        <SelectItem value="deactivate">❌ Deactivate</SelectItem>
                                        <SelectItem value="verify">📧 Verify Email</SelectItem>
                                        <SelectItem value="export">📤 Export</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <Button size="sm">
                            📤 Export List
                        </Button>
                        <Link href={`/users/create?role=${roleType}`}>
                            <Button size="sm">
                                ➕ Add {roleType.replace('_', ' ')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {userList.length > 0 ? (
                    <div className="space-y-4">
                        {/* Select All */}
                        <div className="flex items-center space-x-2 pb-2 border-b">
                            <Checkbox
                                id={`select-all-${roleType}`}
                                checked={userList.every(user => selectedUsers.includes(user.id))}
                                onCheckedChange={(checked) => handleSelectAll(userList, checked as boolean)}
                            />
                            <label htmlFor={`select-all-${roleType}`} className="text-sm font-medium">
                                Select All
                            </label>
                        </div>

                        {/* User List */}
                        <div className="space-y-3">
                            {userList.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                                        />
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                                <Badge className={getStatusColor(user.status)}>
                                                    {user.status}
                                                </Badge>
                                                {!user.email_verified_at && (
                                                    <Badge variant="outline" className="text-xs">
                                                        📧 Unverified
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            {user.laboratory && (
                                                <p className="text-xs text-gray-500">
                                                    🏢 {user.laboratory.name}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                                <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                                                {user.last_login && (
                                                    <span>Last login: {new Date(user.last_login).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    👁️ View
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle className="flex items-center gap-2">
                                                        {getRoleIcon(user.role)} {user.name}
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        User details and account information
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Basic Information</h4>
                                                            <div className="space-y-1 text-sm">
                                                                <p><strong>Name:</strong> {user.name}</p>
                                                                <p><strong>Email:</strong> {user.email}</p>
                                                                <p><strong>Role:</strong> {user.role}</p>
                                                                <p><strong>Status:</strong> 
                                                                    <Badge className={`ml-2 ${getStatusColor(user.status)}`}>
                                                                        {user.status}
                                                                    </Badge>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        {user.laboratory && (
                                                            <div>
                                                                <h4 className="font-semibold mb-2">Laboratory</h4>
                                                                <div className="space-y-1 text-sm">
                                                                    <p><strong>Name:</strong> {user.laboratory.name}</p>
                                                                    <p><strong>Code:</strong> {user.laboratory.code}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Account Status</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex items-center justify-between">
                                                                    <span>Email Verified:</span>
                                                                    <Badge className={user.email_verified_at ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                                        {user.email_verified_at ? '✅ Yes' : '❌ No'}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <span>Account Status:</span>
                                                                    <Badge className={getStatusColor(user.status)}>
                                                                        {user.status}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Activity</h4>
                                                            <div className="space-y-1 text-sm">
                                                                <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                                                                {user.last_login && (
                                                                    <p><strong>Last Login:</strong> {new Date(user.last_login).toLocaleDateString()}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <Separator className="my-4" />
                                                
                                                <div className="flex justify-end space-x-2">
                                                    <Link href={`/users/${user.id}/edit`}>
                                                        <Button variant="outline">✏️ Edit</Button>
                                                    </Link>
                                                    {user.status === 'pending' && (
                                                        <Button 
                                                            onClick={() => router.post(route('users.verify', user.id))}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            ✅ Verify & Activate
                                                        </Button>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <Link href={`/users/${user.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                ✏️ Edit
                                            </Button>
                                        </Link>
                                        {user.status === 'pending' && (
                                            <Button 
                                                size="sm"
                                                onClick={() => router.post(route('users.verify', user.id))}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                ✅ Verify
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">{getRoleIcon(roleType)}</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No {roleType.replace('_', ' ')} found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Get started by adding your first {roleType.replace('_', ' ')}.
                        </p>
                        <Link href={`/users/create?role=${roleType}`}>
                            <Button>
                                ➕ Add {roleType.replace('_', ' ')}
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow">
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

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Users</p>
                                <p className="text-3xl font-bold text-green-600">{stats.active_users}</p>
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
                                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pending_users}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Email Verified</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.verified_users}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <span className="text-2xl">📧</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                            placeholder="🔍 Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="md:col-span-2"
                        />
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="📊 Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="🏢 Laboratory" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Labs</SelectItem>
                                {laboratories.map((lab) => (
                                    <SelectItem key={lab.id} value={lab.id.toString()}>
                                        {lab.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* User Management Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="admins" className="flex items-center gap-2">
                        👨‍💼 Admins ({users.admins.length})
                    </TabsTrigger>
                    <TabsTrigger value="lab_staff" className="flex items-center gap-2">
                        🔬 Lab Staff ({users.lab_staff.length})
                    </TabsTrigger>
                    <TabsTrigger value="lecturers" className="flex items-center gap-2">
                        👨‍🏫 Lecturers ({users.lecturers.length})
                    </TabsTrigger>
                    <TabsTrigger value="students" className="flex items-center gap-2">
                        👩‍🎓 Students ({users.students.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="admins" className="mt-6">
                    {renderUserTable(users.admins, 'admin')}
                </TabsContent>

                <TabsContent value="lab_staff" className="mt-6">
                    {renderUserTable(users.lab_staff, 'lab_staff')}
                </TabsContent>

                <TabsContent value="lecturers" className="mt-6">
                    {renderUserTable(users.lecturers, 'lecturer')}
                </TabsContent>

                <TabsContent value="students" className="mt-6">
                    {renderUserTable(users.students, 'student')}
                </TabsContent>
            </Tabs>
        </div>
    );
}