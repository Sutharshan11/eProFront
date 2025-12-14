import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBranch, type Branch } from '../api/branches';
import { Button } from './ui';
import { Dialog, DialogContent } from './ui/Dialog';
import { useToast } from '../context/ToastContext';
import { MapPin, Building2 } from 'lucide-react';

interface EditBranchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    branch: Branch | null;
}

const EditBranchDialog = ({ isOpen, onClose, branch }: EditBranchDialogProps) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const queryClient = useQueryClient();
    const { success, error } = useToast();

    useEffect(() => {
        if (branch) {
            setName(branch.name);
            setLocation(branch.location);
        }
    }, [branch]);

    const mutation = useMutation({
        mutationFn: (data: { name: string; location: string }) =>
            updateBranch(branch!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            success('Branch updated successfully');
            onClose();
        },
        onError: () => {
            error('Failed to update branch');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (branch) {
            mutation.mutate({ name, location });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md" title="Edit Branch Details">
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Branch Name
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location
                        </label>
                        <input
                            type="text"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditBranchDialog;
