import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api/users';
import { Button } from './ui';

interface AddUserFormProps {
    onSuccess: () => void;
}

const AddUserForm = ({ onSuccess }: AddUserFormProps) => {
    const { register, handleSubmit, reset } = useForm();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            reset();
            onSuccess();
        },
    });

    const onSubmit = (data: any) => {
        const payload = { ...data };
        if (data.branchId) {
            payload.branchId = parseInt(data.branchId, 10);
        } else {
            delete payload.branchId;
        }
        mutation.mutate(payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Full Name</label>
                <input {...register("name", { required: true })} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950" placeholder="John Doe" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Email Address</label>
                <input type="email" {...register("email", { required: true })} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950" placeholder="john@example.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Password</label>
                    <input type="password" {...register("password", { required: true })} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Role</label>
                    <select {...register("role", { required: true })} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950">
                        <option value="STAFF">Staff</option>
                        <option value="BRANCH_MANAGER">Branch Manager</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Branch ID (Optional)</label>
                <input type="number" {...register("branchId")} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950" placeholder="1" />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Creating User...' : 'Create User'}
                </Button>
            </div>
        </form>
    );
};

export default AddUserForm;
