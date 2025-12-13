import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser, type User } from '../api/users';
import { Button, Badge, Card } from '../components/ui';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/Dialog';
import AddUserForm from '../components/AddUserForm';
import EditUserRole from '../components/EditUserRole';
import { Plus, Users as UsersIcon, Mail, Shield, Edit2, Trash2 } from 'lucide-react';

const Users = () => {
    const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setDeletingUser(null);
            alert('User deleted successfully!');
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Failed to delete user');
        },
    });

    if (isLoading) return <div className="p-8">Loading users...</div>;

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'error'; // Red
            case 'ADMIN': return 'warning'; // Yellow
            case 'BRANCH_MANAGER': return 'success'; // Green
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User Management</h1>
                    <p className="text-gray-500 mt-1">Manage system access and user roles.</p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add New User
                        </Button>
                    </DialogTrigger>
                    <DialogContent title="Add New User">
                        <AddUserForm onSuccess={() => setIsModalOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold">User</th>
                            <th className="px-6 py-4 font-semibold">Email</th>
                            <th className="px-6 py-4 font-semibold">Role</th>
                            <th className="px-6 py-4 font-semibold">Branch</th>
                            <th className="px-6 py-4 font-semibold">Joined</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users?.map((user: User) => (
                            <tr key={user.id} className="bg-white hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-900">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-gray-400" />
                                        {user.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={getRoleBadge(user.role)}>
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            {user.role}
                                        </div>
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {user.branch?.name || <span className="text-gray-400 italic">Global</span>}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                                            <DialogTrigger asChild>
                                                <button
                                                    onClick={() => setEditingUser(user)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit Role"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent title="Edit User Role">
                                                <EditUserRole
                                                    userId={user.id}
                                                    currentRole={user.role}
                                                    userName={user.name}
                                                    onSuccess={() => {
                                                        setEditingUser(null);
                                                        queryClient.invalidateQueries({ queryKey: ['users'] });
                                                        alert('User role updated successfully!');
                                                    }}
                                                    onCancel={() => setEditingUser(null)}
                                                />
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog open={deletingUser?.id === user.id} onOpenChange={(open) => !open && setDeletingUser(null)}>
                                            <DialogTrigger asChild>
                                                <button
                                                    onClick={() => setDeletingUser(user)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent title="Confirm Delete">
                                                <div className="space-y-4">
                                                    <p className="text-gray-600">
                                                        Are you sure you want to delete user <strong>{user.name}</strong>?
                                                    </p>
                                                    <p className="text-sm text-red-600">
                                                        This action cannot be undone.
                                                    </p>
                                                    <div className="flex gap-3 pt-2">
                                                        <Button
                                                            onClick={() => deleteMutation.mutate(user.id)}
                                                            disabled={deleteMutation.isPending}
                                                            variant="danger"
                                                            className="flex-1"
                                                        >
                                                            {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => setDeletingUser(null)}
                                                            disabled={deleteMutation.isPending}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Users;
