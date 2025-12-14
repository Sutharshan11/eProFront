import { Dialog, DialogContent, DialogTrigger } from './ui/Dialog';
import { Button, Badge } from './ui';
import { X, Printer } from 'lucide-react';

interface AssetDetailsModalProps {
    asset: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const AssetDetailsModal = ({ asset, open, onOpenChange }: AssetDetailsModalProps) => {
    if (!asset) return null;

    const DetailItem = ({ label, value, className = "" }: { label: string, value: React.ReactNode, className?: string }) => (
        <div className={`space-y-1 ${className}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
            <div className="text-sm font-medium text-gray-900 break-words">{value || '-'}</div>
        </div>
    );

    const formatCurrency = (amount: number) => {
        if (amount === undefined || amount === null) return '-';
        return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent title={`Asset Details: ${asset.assetId}`} className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-start border-b pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{asset.name}</h2>
                            <p className="text-gray-500 text-sm font-mono mt-1">{asset.assetCode || asset.assetId}</p>
                        </div>
                        <Badge variant={asset.status === 'Active' ? 'success' : 'default'}>
                            {asset.status}
                        </Badge>
                    </div>

                    {/* Primary Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DetailItem label="Asset Type" value={asset.assetType?.name || asset.category} />
                        <DetailItem label="Quantity" value={asset.quantity} />
                        <DetailItem label="Center" value={asset.center?.name} />

                        <DetailItem label="Section" value={asset.section?.name} />
                        <DetailItem label="Current Location" value={asset.currentLocation || asset.branch?.name} />
                        <DetailItem label="New Section" value={asset.newSection || asset.currentSection?.name} />
                    </div>

                    <hr className="border-gray-100" />

                    {/* Financial & Purchase Information */}
                    <h3 className="text-sm font-bold text-gray-900 border-l-4 border-indigo-500 pl-3">Purchase & Financial Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DetailItem label="Purchase Date" value={formatDate(asset.purchaseDate)} />
                        <DetailItem label="Purchase Price" value={formatCurrency(asset.purchasePrice || asset.value)} />
                        <DetailItem label="Reevaluation Price" value={formatCurrency(asset.revaluationPrice)} />
                        <DetailItem label="GRN Number" value={asset.grnNumber} />
                        <DetailItem label="Inventory Page" value={asset.inventoryPageNo} />
                        <DetailItem label="Consumable Status" value={asset.transferredToConsumable ?
                            <Badge variant="warning">Transferred to Consumable</Badge> :
                            <span className="text-gray-500">Asset</span>
                        } />
                    </div>

                    <hr className="border-gray-100" />

                    {/* Board of Survey */}
                    <h3 className="text-sm font-bold text-gray-900 border-l-4 border-indigo-500 pl-3">Board of Survey (BOS)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DetailItem label="BOS Category" value={asset.boardOfSurveyCategory?.name || asset.boardOfSurveyCategory?.code} />
                        <DetailItem label="BOS Year" value={asset.boardOfSurveyYear?.year} />
                        <DetailItem label="Remarks" value={asset.remarks} className="col-span-2" />
                    </div>


                    {/* Actions Footer */}
                    <div className="flex justify-end pt-6 border-t mt-4 gap-3">
                        <Button variant="secondary" onClick={() => window.print()}>
                            <Printer className="w-4 h-4 mr-2" />
                            Print Details
                        </Button>
                        <Button onClick={() => onOpenChange(false)}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssetDetailsModal;
