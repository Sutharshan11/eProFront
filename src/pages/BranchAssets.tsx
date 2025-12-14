import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBranchById } from '../api/branches';
import { getAssets } from '../api/assets';
import { Card, Badge, Button } from '../components/ui';
import { Printer, Download, ArrowLeft, Building2, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent } from '../components/ui/Dialog';
import EditAssetModal from '../components/EditAssetModal';
import DeleteAssetDialog from '../components/DeleteAssetDialog';

const BranchAssets = () => {
    const { branchId } = useParams();
    const id = Number(branchId);

    // Asset Dialog States
    const [editAsset, setEditAsset] = useState<any>(null);
    const [isEditAssetOpen, setIsEditAssetOpen] = useState(false);
    const [deleteAsset, setDeleteAsset] = useState<any>(null);

    const { data: branch, isLoading: isBranchLoading } = useQuery({
        queryKey: ['branch', id],
        queryFn: () => getBranchById(id),
        enabled: !!id
    });

    const { data: assets, isLoading: isAssetsLoading } = useQuery({
        queryKey: ['assets', { branchId: id }],
        queryFn: () => getAssets({ branchId: id }),
        enabled: !!id
    });

    if (isBranchLoading || isAssetsLoading) return <div className="p-8">Loading...</div>;

    if (!branch) return <div className="p-8">Branch not found.</div>;

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        if (!assets || assets.length === 0) return;

        // Simple CSV Export
        const headers = ['Asset ID', 'Name', 'Category', 'Status', 'Value', 'Assigned Date'];
        const rows = assets.map((asset: any) => [
            asset.assetId,
            asset.name,
            asset.category,
            asset.status,
            asset.value,
            new Date(asset.createdAt).toLocaleDateString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map((e: any[]) => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${branch.name}_assets.csv`);
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 print:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-4">
                    <Link to="/branches">
                        <Button variant="ghost">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Branches
                        </Button>
                    </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button onClick={handlePrint}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print Report
                    </Button>
                </div>
            </div>

            <Card className="p-6 print:shadow-none print:border-none">
                <div className="flex items-start justify-between mb-8 border-b border-gray-100 pb-6 print:mb-4 print:pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-5 h-5 text-gray-400" />
                            <h1 className="text-2xl font-bold text-gray-900">{branch.name}</h1>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {branch.location}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Assets</p>
                        <p className="text-3xl font-bold text-gray-900">{assets?.length || 0}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100 print:bg-white">
                            <tr>
                                <th className="px-6 py-3 font-semibold print:px-2">Asset ID</th>
                                <th className="px-6 py-3 font-semibold print:px-2">Name</th>
                                <th className="px-6 py-3 font-semibold print:px-2">Category</th>
                                <th className="px-6 py-3 font-semibold print:px-2">Status</th>
                                <th className="px-6 py-3 font-semibold print:px-2 text-right">Value (LKR)</th>
                                <th className="px-6 py-3 font-semibold print:px-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {assets?.map((asset: any) => (
                                <tr key={asset.id} className="bg-white print:border-b print:border-gray-200">
                                    <td className="px-6 py-3 font-mono text-xs font-medium text-gray-500 print:px-2">{asset.assetId}</td>
                                    <td className="px-6 py-3 font-medium text-gray-900 print:px-2">{asset.name}</td>
                                    <td className="px-6 py-3 text-gray-600 print:px-2">{asset.category}</td>
                                    <td className="px-6 py-3 print:px-2">
                                        <Badge variant={asset.status === 'Active' ? 'success' : 'default'}>
                                            {asset.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-3 text-right font-mono text-gray-600 print:px-2">
                                        {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(asset.value)}
                                    </td>
                                    <td className="px-6 py-3 text-right print:px-2 print:hidden">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                                                title="Edit Asset"
                                                onClick={() => {
                                                    setEditAsset(asset);
                                                    setIsEditAssetOpen(true);
                                                }}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                title="Delete Asset"
                                                onClick={() => setDeleteAsset(asset)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!assets || assets.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No assets assigned to this branch.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>



            {/* Asset Dialogs */}
            {editAsset && (
                <Dialog open={isEditAssetOpen} onOpenChange={setIsEditAssetOpen}>
                    <DialogContent title="Edit Asset" className="sm:max-w-[700px]">
                        <EditAssetModal
                            asset={editAsset}
                            onSuccess={() => setIsEditAssetOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            )}

            {deleteAsset && (
                <DeleteAssetDialog
                    assetId={deleteAsset.id}
                    assetName={deleteAsset.name}
                    open={!!deleteAsset}
                    onOpenChange={(open) => !open && setDeleteAsset(null)}
                    onSuccess={() => setDeleteAsset(null)}
                />
            )}

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:block {
                        display: block !important;
                    }
                    div:has(> .print\\:shadow-none) * {
                        visibility: visible;
                    }
                    div:has(> .print\\:shadow-none) {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default BranchAssets;
