import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createAsset } from '../api/assets';
import { getBranches } from '../api/branches';
import { Button } from './ui';

interface AddAssetFormProps {
    onSuccess: () => void;
}

const AddAssetForm = ({ onSuccess }: AddAssetFormProps) => {
    const { register, handleSubmit, reset } = useForm();
    const queryClient = useQueryClient();

    const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: getBranches });

    const mutation = useMutation({
        mutationFn: createAsset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            reset();
            onSuccess();
        },
    });

    const onSubmit = (data: any) => {
        // Transform data to match API schema
        const branchId = parseInt(data.branchId, 10);
        if (isNaN(branchId)) return; // Prevent submission if no valid branch selected

        mutation.mutate({
            ...data,
            branchId,
            value: parseFloat(data.value),
            status: 'Active'
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Asset ID (Tag)</label>
                    <input {...register("assetId", { required: true })} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="AST-001" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Category</label>
                    <select {...register("category", { required: true })} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus:ring-slate-950">
                        <option value="Furniture">Furniture</option>
                        <option value="Computer">Computer</option>
                        <option value="Accessory">Accessory</option>
                        <option value="Vehicle">Vehicle</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Asset Name / Description</label>
                <input {...register("name", { required: true })} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus:ring-slate-950" placeholder="Dell Latitude 5420 Laptop" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Value (LKR)</label>
                    <input type="number" {...register("value", { required: true })} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus:ring-slate-950" placeholder="150000" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Branch</label>
                    <select {...register("branchId", { required: true })} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus:ring-slate-950">
                        <option value="">Select Branch</option>
                        {branches?.map((branch: any) => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : 'Save Asset'}
                </Button>
            </div>
        </form>
    );
};

export default AddAssetForm;
