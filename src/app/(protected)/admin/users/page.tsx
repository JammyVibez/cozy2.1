
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { 
  Search, 
  More, 
  Profile, 
  Delete,
  Check,
  Close
} from '@/svg_components';

interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePhoto?: string;
  isVerified: boolean;
  isActive: boolean;
  isBanned: boolean;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  banReason?: string;
  bannedAt?: string;
  suspendedUntil?: string;
  createdAt: string;
  lastLoginAt?: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
    communities: number;
  };
  violations?: {
    id: string;
    type: string;
    reason: string;
    createdAt: string;
  }[];
}

const USER_ROLES = [
  { value: 'USER', label: 'User', color: 'bg-gray-100 text-gray-700' },
  { value: 'MODERATOR', label: 'Moderator', color: 'bg-blue-100 text-blue-700' },
  { value: 'ADMIN', label: 'Admin', color: 'bg-red-100 text-red-700' }
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');

  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Mock users data - replace with actual API call
  const mockUsers: AdminUser[] = [
    {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      profilePhoto: '/avatars/john.jpg',
      isVerified: true,
      isActive: true,
      isBanned: false,
      role: 'USER',
      createdAt: '2024-01-15T10:30:00Z',
      lastLoginAt: '2024-01-20T15:45:00Z',
      stats: {
        posts: 45,
        followers: 120,
        following: 80,
        communities: 5
      }
    },
    {
      id: '2',
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      isVerified: false,
      isActive: true,
      isBanned: false,
      role: 'MODERATOR',
      createdAt: '2024-01-10T08:20:00Z',
      lastLoginAt: '2024-01-20T12:30:00Z',
      stats: {
        posts: 23,
        followers: 89,
        following: 95,
        communities: 3
      }
    },
    {
      id: '3',
      name: 'Bob Johnson',
      username: 'bobjohnson',
      email: 'bob@example.com',
      isVerified: false,
      isActive: false,
      isBanned: true,
      role: 'USER',
      createdAt: '2024-01-05T14:15:00Z',
      stats: {
        posts: 12,
        followers: 34,
        following: 67,
        communities: 1
      },
      violations: [
        {
          id: '1',
          type: 'spam',
          reason: 'Repeated spam posting',
          createdAt: '2024-01-18T16:00:00Z'
        }
      ]
    }
  ];

  const { data: users = mockUsers, isLoading } = useQuery({
    queryKey: ['admin-users', searchQuery, selectedRole, selectedStatus],
    queryFn: async () => {
      // Replace with actual API call
      return mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
        const matchesStatus = selectedStatus === 'ALL' || 
                            (selectedStatus === 'ACTIVE' && user.isActive && !user.isBanned) ||
                            (selectedStatus === 'INACTIVE' && !user.isActive) ||
                            (selectedStatus === 'BANNED' && user.isBanned);
        
        return matchesSearch && matchesRole && matchesStatus;
      });
    },
  });

  // User management mutations
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<AdminUser> }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast({ title: 'User updated successfully', type: 'success' });
      setShowUserModal(false);
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      showToast({ title: 'Error', message: error.message, type: 'error' });
    },
  });

  const banUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to ban user');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast({ title: 'User banned successfully', type: 'success' });
      setShowBanModal(false);
      setBanReason('');
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      showToast({ title: 'Error', message: error.message, type: 'error' });
    },
  });

  const unbanUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unban user');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast({ title: 'User unbanned successfully', type: 'success' });
    },
    onError: (error: Error) => {
      showToast({ title: 'Error', message: error.message, type: 'error' });
    },
  });

  const premiumBadgeMutation = useMutation({
    mutationFn: async ({ userId, action, badgeType }: { userId: string; action: 'grant' | 'revoke'; badgeType?: string }) => {
      const response = await fetch(`/api/admin/users/${userId}/premium`, {
        method: action === 'grant' ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: action === 'grant' ? JSON.stringify({ badgeType: badgeType || 'VERIFIED' }) : undefined,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${action} premium badge`);
      }
      
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast({ 
        title: variables.action === 'grant' ? 'Premium badge granted' : 'Premium badge revoked', 
        type: 'success' 
      });
    },
    onError: (error: Error) => {
      showToast({ title: 'Error', message: error.message, type: 'error' });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      showToast({ title: 'User deleted successfully', type: 'success' });
    },
    onError: (error: Error) => {
      showToast({ title: 'Error', message: error.message, type: 'error' });
    },
  });

  const handleUserAction = (user: AdminUser, action: string) => {
    setSelectedUser(user);
    
    switch (action) {
      case 'view':
        setShowUserModal(true);
        break;
      case 'ban':
        setShowBanModal(true);
        break;
      case 'unban':
        unbanUserMutation.mutate(user.id);
        break;
      case 'verify':
        premiumBadgeMutation.mutate({
          userId: user.id,
          action: 'grant',
          badgeType: 'VERIFIED'
        });
        break;
      case 'unverify':
        premiumBadgeMutation.mutate({
          userId: user.id,
          action: 'revoke'
        });
        break;
      case 'suspend':
        updateUserMutation.mutate({
          userId: user.id,
          updates: { 
            isActive: false,
            suspendedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
          }
        });
        break;
      case 'unsuspend':
        updateUserMutation.mutate({
          userId: user.id,
          updates: { 
            isActive: true,
            suspendedUntil: undefined
          }
        });
        break;
      case 'delete':
        if (confirm(`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`)) {
          deleteUserMutation.mutate(user.id);
        }
        break;
      case 'grant-premium':
        premiumBadgeMutation.mutate({
          userId: user.id,
          action: 'grant',
          badgeType: 'PREMIUM'
        });
        break;
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    updateUserMutation.mutate({
      userId,
      updates: { role: newRole as AdminUser['role'] }
    });
  };

  const handleBanUser = () => {
    if (selectedUser && banReason.trim()) {
      banUserMutation.mutate({
        userId: selectedUser.id,
        reason: banReason.trim()
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and account status
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">👥</span>
            <h3 className="font-semibold">Total Users</h3>
          </div>
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-sm text-muted-foreground">
            {users.filter(u => u.isActive).length} active
          </p>
        </div>
        
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">✅</span>
            <h3 className="font-semibold">Verified</h3>
          </div>
          <div className="text-2xl font-bold">
            {users.filter(u => u.isVerified).length}
          </div>
          <p className="text-sm text-muted-foreground">Verified accounts</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🚫</span>
            <h3 className="font-semibold">Banned</h3>
          </div>
          <div className="text-2xl font-bold">
            {users.filter(u => u.isBanned).length}
          </div>
          <p className="text-sm text-muted-foreground">Banned accounts</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">👨‍💼</span>
            <h3 className="font-semibold">Staff</h3>
          </div>
          <div className="text-2xl font-bold">
            {users.filter(u => u.role !== 'USER').length}
          </div>
          <p className="text-sm text-muted-foreground">Moderators & Admins</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-card rounded-xl border">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <TextInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search users..."
              className="pl-10"
            />
          </div>
        </div>
        
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-background"
        >
          <option value="ALL">All Roles</option>
          {USER_ROLES.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-background"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">User</th>
                <th className="text-left p-4 font-semibold">Role</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Stats</th>
                <th className="text-left p-4 font-semibold">Joined</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center p-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.profilePhoto ? (
                          <Image
                            src={user.profilePhoto}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            {user.isVerified && (
                              <span className="text-blue-500">✓</span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            @{user.username}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-full border bg-background"
                        disabled={updateUserMutation.isPending}
                      >
                        {USER_ROLES.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className={cn(
                          'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                          user.isBanned ? 'bg-red-100 text-red-700' :
                          user.isActive ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        )}>
                          {user.isBanned ? 'Banned' : user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {user.lastLoginAt && (
                          <div className="text-xs text-muted-foreground">
                            Last: {format(new Date(user.lastLoginAt), 'MMM d')}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-sm space-y-1">
                        <div>{user.stats.posts} posts</div>
                        <div>{user.stats.followers} followers</div>
                        <div>{user.stats.communities} communities</div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(user.createdAt), 'MMM d, yyyy')}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        <Button
                          size="small"
                          mode="secondary"
                          onPress={() => handleUserAction(user, 'view')}
                        >
                          <Profile className="w-4 h-4" />
                        </Button>
                        
                        {!user.isVerified ? (
                          <Button
                            size="small"
                            onPress={() => handleUserAction(user, 'verify')}
                            loading={premiumBadgeMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            ✓
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            mode="secondary"
                            onPress={() => handleUserAction(user, 'unverify')}
                            loading={premiumBadgeMutation.isPending}
                          >
                            ✗
                          </Button>
                        )}

                        {!user.isActive && !user.isBanned ? (
                          <Button
                            size="small"
                            mode="secondary"
                            onPress={() => handleUserAction(user, 'unsuspend')}
                            loading={updateUserMutation.isPending}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            Unsuspend
                          </Button>
                        ) : !user.isBanned && (
                          <Button
                            size="small"
                            onPress={() => handleUserAction(user, 'suspend')}
                            loading={updateUserMutation.isPending}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            Suspend
                          </Button>
                        )}
                        
                        {user.isBanned ? (
                          <Button
                            size="small"
                            mode="secondary"
                            onPress={() => handleUserAction(user, 'unban')}
                            loading={unbanUserMutation.isPending}
                          >
                            Unban
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            mode="secondary"
                            className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                            onPress={() => handleUserAction(user, 'ban')}
                          >
                            Ban
                          </Button>
                        )}

                        <Button
                          size="small"
                          onPress={() => handleUserAction(user, 'grant-premium')}
                          loading={premiumBadgeMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Premium
                        </Button>
                        
                        <Button
                          size="small"
                          mode="secondary"
                          className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                          onPress={() => handleUserAction(user, 'delete')}
                          loading={deleteUserMutation.isPending}
                        >
                          <Delete className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">User Details</h2>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Close className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    {selectedUser.profilePhoto ? (
                      <Image
                        src={selectedUser.profilePhoto}
                        alt={selectedUser.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                        {selectedUser.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                      <p className="text-muted-foreground">@{selectedUser.username}</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{selectedUser.stats.posts}</div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{selectedUser.stats.followers}</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{selectedUser.stats.following}</div>
                      <div className="text-sm text-muted-foreground">Following</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{selectedUser.stats.communities}</div>
                      <div className="text-sm text-muted-foreground">Communities</div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Account Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Verified:</span>
                          <span className={selectedUser.isVerified ? 'text-green-600' : 'text-red-600'}>
                            {selectedUser.isVerified ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active:</span>
                          <span className={selectedUser.isActive ? 'text-green-600' : 'text-red-600'}>
                            {selectedUser.isActive ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Banned:</span>
                          <span className={selectedUser.isBanned ? 'text-red-600' : 'text-green-600'}>
                            {selectedUser.isBanned ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Dates</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Joined:</span>
                          <span className="text-sm">
                            {format(new Date(selectedUser.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        {selectedUser.lastLoginAt && (
                          <div className="flex justify-between">
                            <span>Last Login:</span>
                            <span className="text-sm">
                              {format(new Date(selectedUser.lastLoginAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Violations */}
                  {selectedUser.violations && selectedUser.violations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Violations</h4>
                      <div className="space-y-2">
                        {selectedUser.violations.map(violation => (
                          <div key={violation.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-medium capitalize">{violation.type}</span>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {violation.reason}
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(violation.createdAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ban User Modal */}
      <AnimatePresence>
        {showBanModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold mb-4">Ban User</h3>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to ban <strong>{selectedUser.name}</strong>?
                This will deactivate their account and prevent them from accessing the platform.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Reason for ban <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Enter the reason for banning this user..."
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  mode="secondary"
                  className="flex-1"
                  onPress={() => {
                    setShowBanModal(false);
                    setBanReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  mode="secondary"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                  onPress={handleBanUser}
                  loading={banUserMutation.isPending}
                  isDisabled={!banReason.trim()}
                >
                  Ban User
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
