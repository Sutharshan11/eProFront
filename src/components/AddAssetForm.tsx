// Removed unused axios import
import { useForm, useWatch } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createAsset, getNextAssetId } from '../api/assets';
import { useEffect } from 'react';
import { getBranches } from '../api/branches';
import { Button } from './ui';

interface AddAssetFormProps {
    onSuccess: () => void;
}

const AddAssetForm = ({ onSuccess }: AddAssetFormProps) => {
    const { register, handleSubmit, reset, setValue, control } = useForm();
    const queryClient = useQueryClient();

    const selectedCategory = useWatch({ control, name: 'category' });

    useEffect(() => {
        if (selectedCategory) {
            getNextAssetId(selectedCategory).then((code: string) => {
                setValue('assetId', code);
            });
        }
    }, [selectedCategory, setValue]);

    const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: getBranches });

    // We can assume these endpoints exist or will be needed. 
    // If not, we might need to rely on what we have or add more endpoints.
    // For now, let's keep it simple and just use what we can likely get or hardcode standard options if endpoints fail.
    // Actually, let's try to just use basic inputs if we can't fetch everything, but ideally we fetch.

    const mutation = useMutation({
        mutationFn: createAsset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            reset();
            onSuccess();
        },
    });

    const onSubmit = (data: any) => {
        const branchId = parseInt(data.branchId, 10);
        if (isNaN(branchId)) return;

        const payload = {
            ...data,
            branchId,
            value: data.value ? parseFloat(data.value) : 0,
            purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : undefined,
            revaluationPrice: data.revaluationPrice ? parseFloat(data.revaluationPrice) : undefined,
            quantity: data.quantity ? parseInt(data.quantity, 10) : 1,
            transferredToConsumable: !!data.transferredToConsumable,

            // Handle relations if we had selects for them
            // centerId: data.centerId ? parseInt(data.centerId) : undefined,
            // sectionId: data.sectionId ? parseInt(data.sectionId) : undefined,
            // assetTypeId: data.assetTypeId ? parseInt(data.assetTypeId) : undefined,
            // boardOfSurveyCategoryId: data.boardOfSurveyCategoryId ? parseInt(data.boardOfSurveyCategoryId) : undefined,
            // boardOfSurveyYearId: data.boardOfSurveyYearId ? parseInt(data.boardOfSurveyYearId) : undefined,
            status: 'Active'
        };
        mutation.mutate(payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 h-[60vh] overflow-y-auto pr-2">

            {/* Basic Identity */}
            {/* Basic Identity */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Category</label>
                    <select {...register("category", { required: true })} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                        <option value="">Select Category</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Computer">Computer</option>
                        <option value="Accessory">Accessory</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Jewellery Equipment">Jewellery Equipment</option>
                        <option value="Lab Equipment">Lab Equipment</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Asset Code</label>
                    <input {...register("assetId", { required: true })} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Auto-generated" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-gray-500">Asset Name</label>
                <input {...register("name", { required: true })} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Item Name" />
            </div>

            {/* Location & Quantity */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Branch / Location</label>
                    <select {...register("branchId", { required: true })} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                        <option value="">Select Branch</option>
                        {branches?.map((branch: any) => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Quantity</label>
                    <input type="number" {...register("quantity")} defaultValue={1} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Current Location</label>
                    <input {...register("currentLocation")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" placeholder="Specific room/spot" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">New Section</label>
                    <input {...register("newSection")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" placeholder="Section Name" />
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Financials */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Purchase Price (LKR)</label>
                    <input type="number" step="0.01" {...register("purchasePrice")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Current Value (LKR)</label>
                    <input type="number" step="0.01" {...register("value")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" placeholder="0.00" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Reevaluation Price</label>
                    <input type="number" step="0.01" {...register("revaluationPrice")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Purchase Date</label>
                    <input type="date" {...register("purchaseDate")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">GRN Number</label>
                    <input {...register("grnNumber")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" placeholder="GRN-XXX" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Inventory Page</label>
                    <input {...register("inventoryPageNo")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" placeholder="Page No" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register("transferredToConsumable")} className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <span className="text-sm font-medium text-gray-700">Transfer to Consumable</span>
                </label>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-gray-500">Remarks</label>
                <textarea {...register("remarks")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none min-h-[60px]" placeholder="Any additional notes..." />
            </div>

            <div className="flex justify-end pt-4 bg-white sticky bottom-0 border-t">
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : 'Save Asset'}
                </Button>
            </div>
        </form>
    );
};

export default AddAssetForm;
