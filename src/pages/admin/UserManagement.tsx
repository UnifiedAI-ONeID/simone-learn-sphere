
import React, { useState } from 'react';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreHorizontal, UserPlus, Eye, Shield } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "student", status: "active", joined: "2024-01-15", courses: 3 },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "educator", status: "active", joined: "2024-02-20", courses: 8 },
    { id: 3, name: "Carol Williams", email: "carol@example.com", role: "student", status: "inactive", joined: "2024-03-10", courses: 1 },
    { id: 4, name: "David Brown", email: "david@example.com", role: "admin", status: "active", joined: "2024-01-05", courses: 0 },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'educator': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <LocalizedText text="User Management" />
              </h1>
              <p className="text-muted-foreground">
                <LocalizedText text="Manage platform users and their roles" />
              </p>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              <LocalizedText text="Add User" />
            </Button>
          </div>
        </div>

        <PlatformCard className="mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="educator">Educators</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              <LocalizedText text="Filter" />
            </Button>
          </div>
        </PlatformCard>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <PlatformCard>
            <div className="text-center">
              <p className="text-2xl font-bold">12,486</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </PlatformCard>
          <PlatformCard>
            <div className="text-center">
              <p className="text-2xl font-bold">10,234</p>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
          </PlatformCard>
          <PlatformCard>
            <div className="text-center">
              <p className="text-2xl font-bold">2,156</p>
              <p className="text-sm text-muted-foreground">Educators</p>
            </div>
          </PlatformCard>
          <PlatformCard>
            <div className="text-center">
              <p className="text-2xl font-bold">96</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </PlatformCard>
        </div>

        <PlatformCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Joined</th>
                  <th className="text-left p-4">Courses</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {user.joined}
                    </td>
                    <td className="p-4 text-sm">
                      {user.courses}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PlatformCard>
      </div>
    </PlatformLayout>
  );
};
