import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Filter, Edit, Trash2, Shield } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  is_active: boolean;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role, is_active')
        .like('email', `%${searchQuery}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast({
        title: "Role updated",
        description: "User role has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (userId: string, newStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, is_active: newStatus } : user
        )
      );

      toast({
        title: "Status updated",
        description: "User status has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: userId }
      });

      if (error) throw error;

      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredUsers = React.useMemo(() => {
    let filtered = [...users];

    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    return filtered;
  }, [users, filterRole]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <UnifiedLocalizedText text="User Management" />
        </CardTitle>
        <CardDescription>
          <UnifiedLocalizedText text="Manage user accounts and roles" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                onClick={handleSearch}
              />
            </div>
            <Button onClick={handleSearch}>
              <UnifiedLocalizedText text="Search" />
            </Button>
          </div>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <UnifiedLocalizedText text="All Roles" />
              </SelectItem>
              <SelectItem value="student">
                <UnifiedLocalizedText text="Student" />
              </SelectItem>
              <SelectItem value="educator">
                <UnifiedLocalizedText text="Educator" />
              </SelectItem>
              <SelectItem value="admin">
                <UnifiedLocalizedText text="Admin" />
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <p>
            <UnifiedLocalizedText text="Loading users..." />
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <UnifiedLocalizedText text="Email" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <UnifiedLocalizedText text="Name" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <UnifiedLocalizedText text="Role" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <UnifiedLocalizedText text="Status" />
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <UnifiedLocalizedText text="Actions" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Select
                        value={user.role}
                        onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <span>{user.role}</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">
                            <UnifiedLocalizedText text="Student" />
                          </SelectItem>
                          <SelectItem value="educator">
                            <UnifiedLocalizedText text="Educator" />
                          </SelectItem>
                          <SelectItem value="admin">
                            <UnifiedLocalizedText text="Admin" />
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Badge variant={user.is_active ? "outline" : "destructive"}>
                        {user.is_active ? (
                          <UnifiedLocalizedText text="Active" />
                        ) : (
                          <UnifiedLocalizedText text="Inactive" />
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(user.id, !user.is_active)}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
