import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateAsset, getBoardOfSurveyMasterData } from '../api/assets';
import type { Asset } from '../api/assets';
import { getBranches } from '../api/branches';
import { Button } from './ui';
import { useToast } from '../context/ToastContext';

interface EditAssetModalProps {
    asset: Asset;
    onSuccess: () => void;
}

const EditAssetModal = ({ asset, onSuccess }: EditAssetModalProps) => {
    const toast = useToast();
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            ...asset,
            branchId: asset.branchId?.toString(),
            purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate).toISOString().split('T')[0] : '',
            transferredToConsumable: asset.transferredToConsumable,
            boardOfSurveyCategoryId: asset.boardOfSurveyCategory?.id?.toString() || (asset as any).boardOfSurveyCategoryId?.toString(),
            boardOfSurveyYearId: asset.boardOfSurveyYear?.id?.toString() || (asset as any).boardOfSurveyYearId?.toString(),
        }
    });

    useEffect(() => {
        reset({
            ...asset,
            branchId: asset.branchId?.toString(),
            purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate).toISOString().split('T')[0] : '',
            transferredToConsumable: asset.transferredToConsumable,
            boardOfSurveyCategoryId: (asset as any).boardOfSurveyCategoryId?.toString() || asset.boardOfSurveyCategory?.id?.toString() || '',
            boardOfSurveyYearId: (asset as any).boardOfSurveyYearId?.toString() || asset.boardOfSurveyYear?.id?.toString() || '',
        });
    }, [asset, reset]);

    const queryClient = useQueryClient();
    const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: getBranches });
    const { data: masterData } = useQuery({ queryKey: ['bosMasterData'], queryFn: getBoardOfSurveyMasterData });

    const mutation = useMutation({
        mutationFn: (data: any) => updateAsset(asset.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            toast.success('Asset updated successfully');
            onSuccess();
        },
        onError: (error: any) => {
            console.error('Update failed:', error);
            toast.error(`Failed to update asset: ${error.response?.data?.message || error.message}`);
        }
    });

    const onSubmit = (data: any) => {
        console.log('Submitting edit form:', data);
        const branchId = parseInt(data.branchId, 10);
        const bosCatId = parseInt(data.boardOfSurveyCategoryId, 10);
        const bosYearId = parseInt(data.boardOfSurveyYearId, 10);

        const payload = {
            ...data,
            branchId: isNaN(branchId) ? undefined : branchId,
            value: data.value ? parseFloat(data.value) : 0,
            purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : undefined,
            revaluationPrice: data.revaluationPrice ? parseFloat(data.revaluationPrice) : undefined,
            quantity: data.quantity ? parseInt(data.quantity, 10) : 1,
            transferredToConsumable: !!data.transferredToConsumable,
            boardOfSurveyCategoryId: isNaN(bosCatId) ? null : bosCatId,
            boardOfSurveyYearId: isNaN(bosYearId) ? null : bosYearId,
        };
        console.log('Payload:', payload);
        mutation.mutate(payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Asset Code</label>
                    <input {...register("assetId")} disabled className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Category</label>
                    <select {...register("category")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                        <option value="Furniture">Furniture</option>
                        <option value="Computer">Computer</option>
                        <option value="Accessory">Accessory</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Jewellery Equipment">Jewellery Equipment</option>
                        <option value="Lab Equipment">Lab Equipment</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-gray-500">Asset Name</label>
                <input {...register("name")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Branch</label>
                    <select {...register("branchId")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                        <option value="">Select Branch</option>
                        {branches?.map((branch: any) => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Status</label>
                    <select {...register("status")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                        <option value="Active">Active</option>
                        <option value="In Use">In Use</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Disposed">Disposed</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Board of Survey</label>
                    <select {...register("boardOfSurveyCategoryId")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                        <option value="">Select Category</option>
                        {masterData?.categories?.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.code} - {cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">BOS Year</label>
                    <select {...register("boardOfSurveyYearId")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                        <option value="">Select Year</option>
                        {masterData?.years?.map((year: any) => (
                            <option key={year.id} value={year.id}>{year.year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Current Location</label>
                    <input {...register("currentLocation")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">New Section</label>
                    <input {...register("newSection")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" />
                </div>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Purchase Price</label>
                    <input type="number" step="0.01" {...register("purchasePrice")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Current Value</label>
                    <input type="number" step="0.01" {...register("value")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Reevaluation Price</label>
                    <input type="number" step="0.01" {...register("revaluationPrice")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Purchase Date</label>
                    <input type="date" {...register("purchaseDate")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">GRN</label>
                    <input {...register("grnNumber")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-gray-500">Inv Page</label>
                    <input {...register("inventoryPageNo")} className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm outline-none" />
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
                <textarea {...register("remarks")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none min-h-[60px]" />
            </div>

            <div className="flex justify-end pt-4 bg-white sticky bottom-0 border-t gap-2">
                <Button variant="ghost" type="button" onClick={() => onSuccess()}>Cancel</Button>
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
};

export default EditAssetModal;
