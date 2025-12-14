import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBranch, type Branch } from '../api/branches';
import { Button } from './ui';
import { Dialog, DialogContent } from './ui/Dialog';
import { useToast } from '../context/ToastContext';
import { AlertTriangle } from 'lucide-react';

interface DeleteBranchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    branch: Branch | null;
}

const DeleteBranchDialog = ({ isOpen, onClose, branch }: DeleteBranchDialogProps) => {
    const queryClient = useQueryClient();
    const { success, error } = useToast();

    const mutation = useMutation({
        mutationFn: () => deleteBranch(branch!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            success('Branch deleted successfully');
            onClose();
        },
        onError: () => {
            error('Failed to delete branch');
        }
    });

    if (!branch) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md" title="Delete Branch?">
                <div>
                    <div className="flex items-center gap-3 text-red-600 mb-4">
                        <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-semibold">Delete Branch?</span>
                    </div>
                    <div className="pt-2 text-gray-600">
                        Are you sure you want to delete <strong>{branch.name}</strong>?
                        This action cannot be undone.

                        {(branch._count?.users! > 0 || branch._count?.assets! > 0) && (
                            <div className="mt-3 p-3 bg-amber-50 text-amber-800 text-sm rounded-md border border-amber-200">
                                <strong>Warning:</strong> This branch has {branch._count?.users} users and {branch._count?.assets} assets associated with it.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Deleting...' : 'Delete Branch'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteBranchDialog;
