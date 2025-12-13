import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAssets } from '../api/assets';
import { Button, Badge, Card } from '../components/ui';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/Dialog';
import AddAssetForm from '../components/AddAssetForm';
import TransferAssetModal from '../components/TransferAssetModal';
import { Plus, Search, Filter, Monitor, Armchair, HelpCircle, ArrowRightLeft } from 'lucide-react';


const Assets = () => {
    const { data: assets, isLoading } = useQuery({ queryKey: ['assets'], queryFn: getAssets });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    // Derived state for filtering
    const filteredAssets = assets?.filter((asset: any) => {
        const matchesSearch =
            asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;
        const matchesCategory = categoryFilter === 'ALL' || asset.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    if (isLoading) return <div className="p-8">Loading assets...</div>;

    const getIcon = (category: string) => {
        if (category.toLowerCase().includes('computer') || category.toLowerCase().includes('laptop')) return <Monitor className="w-5 h-5 text-blue-500" />;
        if (category.toLowerCase().includes('chair') || category.toLowerCase().includes('desk')) return <Armchair className="w-5 h-5 text-amber-500" />;
        return <HelpCircle className="w-5 h-5 text-gray-400" />;
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Active': return 'success';
            case 'In Use': return 'default'; // Mapped from backend? Backend uses Active, etc.
            case 'Damaged': return 'warning';
            case 'Disposed': return 'error';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Head Office Assets</h1>
                    <p className="text-gray-500 mt-1">Manage and track office furniture and equipment efficiently.</p>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Asset
                        </Button>
                    </DialogTrigger>
                    <DialogContent title="Add New Asset">
                        <AddAssetForm onSuccess={() => setIsModalOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters Bar */}
            <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search assets by ID, name, or category..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="ALL">All Categories</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Computer">Computer</option>
                        <option value="Accessory">Accessory</option>
                        <option value="Vehicle">Vehicle</option>
                    </select>
                    <select
                        className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Disposed">Disposed</option>
                    </select>
                </div>
            </Card>

            {/* Asset Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Asset Details</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Branch</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Value (LKR)</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAssets?.map((asset: any) => (
                                <tr key={asset.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                {getIcon(asset.category)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{asset.name}</div>
                                                <div className="text-gray-500 text-xs font-mono">{asset.assetId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{asset.category}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {/* <Building2 className="w-3 h-3 text-gray-400" /> */}
                                            <span className="text-gray-900 font-medium">{asset.branch?.name || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-600">
                                        {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(asset.value)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" title="Transfer Asset">
                                                        <ArrowRightLeft className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent title={`Transfer Asset: ${asset.name}`}>
                                                    <TransferAssetModal
                                                        assetId={asset.id}
                                                        currentBranchId={asset.branchId}
                                                        onSuccess={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))} // Hacky close or pass setOpen prop
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!filteredAssets || filteredAssets.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                                <Search className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="font-medium">No assets found</p>
                                            <p className="text-sm">Get started by adding your first asset.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* TODO: Add Asset Modal (Implementing next) */}
        </div>
    );
};

export default Assets;
