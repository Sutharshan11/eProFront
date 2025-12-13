
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTransferRequests, updateTransferStatus, type TransferRequest } from '../api/transfers';
import { Card, Badge, Button } from '../components/ui';
import { Check, X } from 'lucide-react';

const Transfers = () => {
    const queryClient = useQueryClient();
    const { data: transfers, isLoading } = useQuery({ queryKey: ['transfers'], queryFn: getTransferRequests });

    const mutation = useMutation({
        mutationFn: updateTransferStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transfers'] });
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            queryClient.invalidateQueries({ queryKey: ['branches'] });
        },
        onError: (error: any) => {
            alert(`Error: ${error.response?.data?.message || 'Failed to update status'}`);
        }
    });

    const [selectedTransfer, setSelectedTransfer] = useState<{ id: number, status: 'APPROVED' | 'REJECTED' } | null>(null);
    const [remarks, setRemarks] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleActionClick = (id: number, status: 'APPROVED' | 'REJECTED') => {
        setSelectedTransfer({ id, status });
        setRemarks('');
        setIsConfirmOpen(true);
    };

    const confirmAction = () => {
        if (selectedTransfer) {
            mutation.mutate({ id: selectedTransfer.id, status: selectedTransfer.status, remarks });
            setIsConfirmOpen(false);
        }
    };

    if (isLoading) return <div className="p-8">Loading requests...</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'error';
            default: return 'warning';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Transfer Requests</h1>
                <p className="text-gray-500 mt-1">Manage asset movement between branches.</p>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Asset</th>
                                <th className="px-6 py-4 font-semibold">From</th>
                                <th className="px-6 py-4 font-semibold">To</th>
                                <th className="px-6 py-4 font-semibold">Reason</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transfers?.map((request: TransferRequest) => (
                                <tr key={request.id} className="bg-white hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{request.asset.name}</div>
                                        <div className="text-xs text-gray-500 font-mono">{request.asset.assetId}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{request.fromBranch.name}</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">{request.toBranch.name}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div>{request.reason}</div>
                                        {request.remarks && (
                                            <div className="text-xs text-gray-500 mt-1 italic border-l-2 border-gray-200 pl-2">
                                                By Admin: {request.remarks}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                        {new Date(request.requestDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={getStatusColor(request.status)}>{request.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {request.status === 'PENDING' && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="primary"
                                                    className="h-8 w-8 p-0 rounded-full bg-green-600 hover:bg-green-700"
                                                    title="Approve"
                                                    onClick={() => handleActionClick(request.id, 'APPROVED')}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    className="h-8 w-8 p-0 rounded-full"
                                                    title="Reject"
                                                    onClick={() => handleActionClick(request.id, 'REJECTED')}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {(!transfers || transfers.length === 0) && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <p>No pending transfer requests.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Confirmation Dialog */}
            {isConfirmOpen && selectedTransfer && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {selectedTransfer.status === 'APPROVED' ? 'Approve Transfer' : 'Reject Transfer'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to {selectedTransfer.status.toLowerCase()} this request?
                            You can add optional remarks below.
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                rows={3}
                                placeholder="Enter any notes about this decision..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
                            <Button
                                variant={selectedTransfer.status === 'APPROVED' ? 'primary' : 'danger'}
                                onClick={confirmAction}
                            >
                                Confirm {selectedTransfer.status === 'APPROVED' ? 'Approval' : 'Rejection'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transfers;
