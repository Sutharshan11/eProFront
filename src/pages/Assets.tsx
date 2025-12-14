import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssets, restoreAsset } from '../api/assets';
import { Button, Badge, Card } from '../components/ui';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/Dialog';
import AddAssetForm from '../components/AddAssetForm';
import TransferAssetModal from '../components/TransferAssetModal';
import AssetDetailsModal from '../components/AssetDetailsModal';
import EditAssetModal from '../components/EditAssetModal';
import DeleteAssetDialog from '../components/DeleteAssetDialog';
import AssetHistoryModal from '../components/AssetHistoryModal';
import { useToast } from '../context/ToastContext';
import { Plus, Search, ArrowRightLeft, Eye, Pencil, Trash2, Download, Printer, RotateCcw, History as HistoryIcon } from 'lucide-react';

const Assets = () => {
    const { data: assets, isLoading, isError } = useQuery({ queryKey: ['assets'], queryFn: () => getAssets() });
    const queryClient = useQueryClient();
    const toast = useToast();

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null); // For Details
    const [editAsset, setEditAsset] = useState<any>(null); // For Edit
    const [transferAsset, setTransferAsset] = useState<any>(null); // For Transfer
    const [deleteAsset, setDeleteAsset] = useState<any>(null); // For Delete
    const [historyAssetId, setHistoryAssetId] = useState<number | null>(null); // For History

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);

    // Restore Mutation
    const restoreMutation = useMutation({
        mutationFn: restoreAsset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            toast.success('Asset restored successfully');
        },
        onError: () => {
            toast.error('Failed to restore asset');
        }
    });

    const handleRestore = (id: number) => {
        if (window.confirm('Are you sure you want to restore this asset?')) {
            restoreMutation.mutate(id);
        }
    };

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [bosYearFilter, setBosYearFilter] = useState('ALL');

    // Derived state for filtering
    const safeAssets = Array.isArray(assets) ? assets : [];
    const filteredAssets = safeAssets.filter((asset: any) => {
        const matchesSearch =
            (asset.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (asset.assetId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (asset.category || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL'
            ? asset.status !== 'Disposed'
            : asset.status === statusFilter;
        const matchesCategory = categoryFilter === 'ALL' || asset.category === categoryFilter;
        const matchesBosYear = bosYearFilter === 'ALL' || (asset.boardOfSurveyYear?.year?.toString() === bosYearFilter);

        return matchesSearch && matchesStatus && matchesCategory && matchesBosYear;
    });

    // ... (Export/Print functions remain)

    // ... (Render logic)


    const handleExportCSV = () => {
        if (!filteredAssets.length) return;

        const headers = ['Asset Code', 'Name', 'Category', 'Status', 'Branch', 'Location', 'Purchase Price', 'Purchase Date', 'Remarks'];
        const csvContent = [
            headers.join(','),
            ...filteredAssets.map((asset: any) => [
                `"${asset.assetCode || asset.assetId || ''}"`,
                `"${asset.name || ''}"`,
                `"${asset.category || ''}"`,
                `"${asset.status || ''}"`,
                `"${asset.branch?.name || ''}"`,
                `"${asset.currentLocation || ''}"`,
                `"${asset.purchasePrice || ''}"`,
                `"${asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : ''}"`,
                `"${asset.remarks || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `assets_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) return <div className="p-8">Loading assets...</div>;
    if (isError) return <div className="p-8 text-red-500">Error loading assets. Please try again.</div>;

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col print:h-auto print:block">
            <style type="text/css" media="print">
                {`
                @page { size: landscape; margin: 10mm; }
                body { background: white; -webkit-print-color-adjust: exact; }
                .no-print { display: none !important; }
                .print-only { display: block !important; }
                /* Hide layout elements that might persist */
                nav, aside, header { display: none !important; }
                `}
            </style>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 no-print">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Asset Management</h1>
                    <p className="text-gray-500 mt-1">Track and manage inventory across all branches.</p>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Asset
                        </Button>
                    </DialogTrigger>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={handleExportCSV} title="Export filtered assets to CSV">
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button variant="secondary" onClick={handlePrint} title="Print current view">
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </Button>
                    </div>
                    <DialogContent title="Add New Asset">
                        <AddAssetForm onSuccess={() => setIsAddModalOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters Bar */}
            <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center flex-wrap no-print">
                <div className="relative flex-1 w-full min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                    <select
                        className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-[150px]"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="ALL">All Categories</option>
                        {Array.from(new Set(safeAssets.map((a: any) => a.category).filter(Boolean))).sort().map((cat: any) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select
                        className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-[150px]"
                        value={bosYearFilter}
                        onChange={(e) => setBosYearFilter(e.target.value)}
                    >
                        <option value="ALL">All BOS Years</option>
                        {Array.from(new Set(safeAssets.map((a: any) => a.boardOfSurveyYear?.year).filter(Boolean))).sort().map((year: any) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <select
                        className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-[150px]"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">Active Only</option>
                        {Array.from(new Set(safeAssets.map((a: any) => a.status).filter((s: any) => s && s !== 'Disposed'))).sort().map((stat: any) => (
                            <option key={stat} value={stat}>{stat}</option>
                        ))}
                        <option value="Disposed">Disposed (Recycle Bin)</option>
                    </select>
                </div>
            </Card>

            {/* Asset Table */}
            <Card className="overflow-hidden flex flex-col h-full shadow-sm border border-gray-200 print:shadow-none print:border-0 print:h-auto">
                <div className="overflow-auto relative h-[calc(100vh-280px)] print:h-auto print:overflow-visible">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100 sticky top-0 z-20 shadow-sm">
                            <tr>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Asset Code</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Center</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Status</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Section</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Asset Type</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Asset Name</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Qty</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">New Inv. Page</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Purchase Date</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Purchase Price</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">GRN</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Remarks</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Reeval. Price (LKR)</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Consumable</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">Cur.Location</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">New Section</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50">BOS Cat</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap bg-gray-50 print:bg-white print:text-black">BOS Year</th>
                                <th className="px-6 py-4 font-semibold whitespace-nowrap text-right bg-gray-50 sticky right-0 z-30 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {filteredAssets?.map((asset: any) => (
                                <tr key={asset.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-900 font-medium whitespace-nowrap">{asset.assetCode || asset.assetId}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{asset.center?.name || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={
                                            asset.status === 'Active' ? 'success' :
                                                asset.status === 'Disposed' ? 'error' :
                                                    asset.status === 'Damaged' ? 'warning' : 'default'
                                        }>
                                            {asset.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{asset.section?.name || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{asset.assetType?.name || asset.category}</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium whitespace-nowrap">
                                        {(() => {
                                            const type = asset.assetType?.name || asset.category;
                                            let displayName = asset.name;

                                            // 1. Remove Asset Type prefix if present
                                            if (type && displayName.toLowerCase().startsWith(type.toLowerCase())) {
                                                displayName = displayName.slice(type.length);
                                            }

                                            // 2. Remove brackets () and clean up leading separators/spaces
                                            // We replace brackets with empty string (or space if needed, but usually brackets wrap extra info)
                                            // But standardizing to remove them completely is safer for "Dell" vs "(Dell)"
                                            return displayName.replace(/[()]/g, '').replace(/^[\s-:]+/, '').trim() || asset.name;
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{asset.quantity}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{asset.inventoryPageNo || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                        {asset.purchasePrice ? new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(asset.purchasePrice) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{asset.grnNumber || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap max-w-[200px] truncate" title={asset.remarks}>{asset.remarks || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                        {asset.revaluationPrice ? new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(asset.revaluationPrice) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {asset.transferredToConsumable ? <Badge variant="warning">Yes</Badge> : <span className="text-gray-400">No</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{asset.currentLocation || asset.branch?.name || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{asset.newSection || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{asset.boardOfSurveyCategory?.code || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{asset.boardOfSurveyYear?.year || '-'}</td>

                                    <td className="px-6 py-4 text-right whitespace-nowrap sticky right-0 z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] bg-inherit no-print">
                                        <div className="flex justify-end gap-2">
                                            {asset.status === 'Disposed' ? (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                                        title="View History"
                                                        onClick={() => setHistoryAssetId(asset.id)}
                                                    >
                                                        <HistoryIcon className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        title="Restore Asset"
                                                        onClick={() => handleRestore(asset.id)}
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                                                        title="View Details"
                                                        onClick={() => {
                                                            setSelectedAsset(asset);
                                                            setIsDetailsOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                                                        title="Edit Asset"
                                                        onClick={() => {
                                                            setEditAsset(asset);
                                                            setIsEditOpen(true);
                                                        }}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                        title="Transfer Asset"
                                                        onClick={() => {
                                                            setTransferAsset(asset);
                                                            setIsTransferOpen(true);
                                                        }}
                                                    >
                                                        <ArrowRightLeft className="w-4 h-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        title="Delete/Dispose Asset"
                                                        onClick={() => setDeleteAsset(asset)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!filteredAssets || filteredAssets.length === 0) && (
                                <tr>
                                    <td colSpan={18} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                                <Search className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="font-medium">No assets found</p>
                                            <p className="text-sm">Try adjusting your filters or search terms.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modals placed OUTSIDE the table loop */}

            <AssetHistoryModal
                assetId={historyAssetId}
                open={!!historyAssetId}
                onOpenChange={(open) => !open && setHistoryAssetId(null)}
            />

            <AssetDetailsModal
                asset={selectedAsset}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
            />

            {editAsset && (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent title="Edit Asset" className="sm:max-w-[700px]">
                        <EditAssetModal
                            asset={editAsset}
                            onSuccess={() => setIsEditOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            )}

            {transferAsset && (
                <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                    <DialogContent title={`Transfer Asset: ${transferAsset.name}`}>
                        <TransferAssetModal
                            assetId={transferAsset.id}
                            currentBranchId={transferAsset.branchId}
                            onSuccess={() => setIsTransferOpen(false)}
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
        </div>
    );
};

export default Assets;
