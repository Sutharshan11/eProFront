import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateUserRole } from '../api/users';
import { Button } from './ui';
import { Shield } from 'lucide-react';

interface EditUserRoleProps {
    userId: number;
    currentRole: string;
    userName: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const roles = ['SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER', 'STAFF'];

const EditUserRole = ({ userId, currentRole, userName, onSuccess, onCancel }: EditUserRoleProps) => {
    const [selectedRole, setSelectedRole] = useState(currentRole);

    const mutation = useMutation({
        mutationFn: () => updateUserRole(userId, selectedRole),
        onSuccess: () => {
            onSuccess();
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Failed to update user role');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRole === currentRole) {
            alert('Please select a different role');
            return;
        }
        mutation.mutate();
    };

    return (
        <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Changing role for:</p>
                <p className="font-semibold text-gray-900 mt-1">{userName}</p>
                <p className="text-xs text-gray-500 mt-1">Current: <span className="font-medium">{currentRole}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y
-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Select New Role</label>
                    <div className="grid grid-cols-2 gap-2">
                        {roles.map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setSelectedRole(role)}
                                className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${selectedRole === role
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span>{role}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        type="submit"
                        disabled={mutation.isPending || selectedRole === currentRole}
                        className="flex-1"
                    >
                        {mutation.isPending ? 'Updating...' : 'Update Role'}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={mutation.isPending}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditUserRole;
