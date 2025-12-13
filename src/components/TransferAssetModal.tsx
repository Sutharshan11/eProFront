import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { requestTransfer } from '../api/transfers';
import { getBranches } from '../api/branches';
import { Button } from './ui';

interface TransferAssetModalProps {
    assetId: number;
    currentBranchId: number;
    onSuccess: () => void;
}

const TransferAssetModal = ({ assetId, currentBranchId, onSuccess }: TransferAssetModalProps) => {
    const { register, handleSubmit, reset } = useForm();
    const queryClient = useQueryClient();

    const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: getBranches });

    const mutation = useMutation({
        mutationFn: requestTransfer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transfers'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            reset();
            onSuccess();
        },
    });

    const onSubmit = (data: any) => {
        mutation.mutate({
            assetId,
            toBranchId: parseInt(data.toBranchId, 10),
            reason: data.reason
        });
    };

    // Filter out current branch from destination options
    const availableBranches = branches?.filter((b: any) => b.id !== currentBranchId);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Destination Branch</label>
                <select {...register("toBranchId", { required: true })} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950">
                    <option value="">Select Branch</option>
                    {availableBranches?.map((branch: any) => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Reason for Transfer</label>
                <textarea {...register("reason", { required: true })} className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950" placeholder="e.g. Broken equipment replacement, excess stock reallocation..." />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Requesting...' : 'Request Transfer'}
                </Button>
            </div>
        </form>
    );
};

export default TransferAssetModal;
