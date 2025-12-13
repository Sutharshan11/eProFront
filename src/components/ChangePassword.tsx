import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../api/auth';
import { Button } from './ui';
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

interface ChangePasswordProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const ChangePassword = ({ onSuccess, onCancel }: ChangePasswordProps) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [error, setError] = useState('');

    const mutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            onSuccess();
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to change password');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        mutation.mutate({ oldPassword, newPassword });
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter current password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter new password (min 6 characters)"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CheckCircle2 className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Confirm new password"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="flex-1"
                    >
                        {mutation.isPending ? 'Changing Password...' : 'Change Password'}
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

export default ChangePassword;
