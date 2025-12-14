import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAsset } from '../api/assets';
import { Button } from './ui';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent } from './ui/Dialog';

interface DeleteAssetDialogProps {
    assetId: number;
    assetName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const DeleteAssetDialog = ({ assetId, assetName, open, onOpenChange, onSuccess }: DeleteAssetDialogProps) => {
    const toast = useToast();
    const [reason, setReason] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => deleteAsset(assetId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            onOpenChange(false);
            setReason('');
            toast.success('Asset disposed successfully');
            onSuccess();
        },
    });

    const handleDelete = () => {
        if (!reason.trim()) return;
        mutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent title="Dispose Asset">
                <div className="space-y-4 pt-2">
                    <div className="bg-red-50 border border-red-100 rounded-md p-3 flex gap-3 text-red-800 text-sm">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <p>
                            Are you sure you want to dispose <strong>{assetName}</strong>?
                            This action cannot be undone immediate and will mark the asset as 'Disposed'.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Reason for Disposal <span className="text-red-500">*</span></label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Damaged beyond repair, Auctioned, Obsolete"
                            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none min-h-[80px]"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            disabled={!reason.trim() || mutation.isPending}
                        >
                            {mutation.isPending ? 'Disposing...' : 'Confirm Disposal'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAssetDialog;
