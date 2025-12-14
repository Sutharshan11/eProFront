import { useQuery } from '@tanstack/react-query';
import { getAssetHistory } from '../api/assets';
import { Dialog, DialogContent } from './ui/Dialog';
import { Loader2, History, User, Calendar } from 'lucide-react';

interface AssetHistoryModalProps {
    assetId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const AssetHistoryModal = ({ assetId, open, onOpenChange }: AssetHistoryModalProps) => {
    const { data: history, isLoading } = useQuery({
        queryKey: ['asset-history', assetId],
        queryFn: () => getAssetHistory(assetId!),
        enabled: !!assetId && open,
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-LK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATED': return 'text-green-700 bg-green-50';
            case 'DISPOSED': return 'text-red-700 bg-red-50';
            case 'RESTORED': return 'text-blue-700 bg-blue-50';
            default: return 'text-gray-700 bg-gray-50';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent title="Asset History & Audit Log" className="sm:max-w-[700px]">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                        <span className="ml-2 text-gray-500">Loading history...</span>
                    </div>
                ) : !history?.length ? (
                    <div className="p-8 text-center text-gray-500">
                        <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No history records found for this asset.</p>
                    </div>
                ) : (
                    <div className="relative overflow-hidden">
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />
                        <div className="space-y-6 p-1">
                            {history.map((record: any) => (
                                <div key={record.id} className="relative pl-12">
                                    {/* Timeline Node */}
                                    <div className={`absolute left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ring-1 ring-gray-200 shadow-sm ${record.action === 'DISPOSED' ? 'bg-red-500' :
                                        record.action === 'CREATED' ? 'bg-green-500' :
                                            record.action === 'RESTORED' ? 'bg-blue-500' : 'bg-gray-400'
                                        }`} />

                                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getActionColor(record.action)}`}>
                                                        {record.action}
                                                    </span>
                                                    <span className="text-gray-400 text-xs flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(record.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-900 text-sm font-medium mt-1">
                                                    {record.details || 'No details provided'}
                                                </p>
                                            </div>
                                            {record.userId && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                                    <User className="w-3 h-3" />
                                                    User #{record.userId}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AssetHistoryModal;
