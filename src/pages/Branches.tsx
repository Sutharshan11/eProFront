import { useQuery } from '@tanstack/react-query';
import { getBranches, type Branch } from '../api/branches';
import { Card, Badge } from '../components/ui';
import { Building2, MapPin, Users, Box } from 'lucide-react';
import { Link } from 'react-router-dom';

const Branches = () => {
    const { data: branches, isLoading } = useQuery({ queryKey: ['branches'], queryFn: getBranches });

    const headOffice = branches?.find((b: Branch) => b.name.toLowerCase() === 'head office');
    const colomboCenter = branches?.find((b: Branch) => b.name.toLowerCase().includes('colombo'));

    const regionalBranches = branches
        ?.filter((b: Branch) => b.name.toLowerCase() !== 'head office' && !b.name.toLowerCase().includes('colombo'))
        .sort((a: Branch, b: Branch) => a.name.localeCompare(b.name));

    if (isLoading) return <div className="p-8">Loading branches...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Branches Overview</h1>
                <p className="text-gray-500 mt-1">Manage Head Office and Regional Branch assets.</p>
            </div>

            {/* Head Office & Colombo Section */}
            {(headOffice || colomboCenter) && (
                <div className="animate-fade-in-up space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800 px-1">Head Office & Main Centers</h2>

                    {/* Head Office Card */}
                    {headOffice && (
                        <Link to={`/branches/${headOffice.id}`} className="block group">
                            <Card className="p-8 border-l-4 border-l-amber-500 hover:shadow-lg transition-all bg-gradient-to-r from-amber-50/50 to-orange-50/30 border border-amber-100">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-200">
                                            <Building2 className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                                                    {headOffice.name}
                                                </h3>
                                                <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-amber-200">
                                                    Main Hub
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-500 mb-2">
                                                <MapPin className="w-4 h-4 mr-1.5" />
                                                {headOffice.location}
                                            </div>
                                            <p className="text-sm text-gray-500 max-w-md">
                                                Central administration and main asset repository.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between items-end gap-4 h-full border-l border-amber-200/50 pl-8">


                                        <div className="flex gap-8">
                                            <div className="text-center min-w-[80px]">
                                                <div className="flex items-center justify-center text-xs text-gray-500 mb-1">
                                                    <Users className="w-4 h-4 mr-1" /> Staff
                                                </div>
                                                <span className="text-3xl font-bold text-gray-900">{headOffice._count?.users || 0}</span>
                                            </div>
                                            <div className="text-center min-w-[80px]">
                                                <div className="flex items-center justify-center text-xs text-gray-500 mb-1">
                                                    <Box className="w-4 h-4 mr-1" /> Assets
                                                </div>
                                                <span className="text-3xl font-bold text-amber-600">{headOffice._count?.assets || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    )}

                    {/* Colombo Center Card - Separately Displayed */}
                    {colomboCenter && (
                        <Link to={`/branches/${colomboCenter.id}`} className="block group">
                            <Card className="p-8 border-l-4 border-l-blue-500 hover:shadow-lg transition-all bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border border-blue-100">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                                            <Building2 className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                    {colomboCenter.name}
                                                </h3>
                                                <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-blue-200">
                                                    Primary Center
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-500 mb-2">
                                                <MapPin className="w-4 h-4 mr-1.5" />
                                                {colomboCenter.location}
                                            </div>
                                            <p className="text-sm text-gray-500 max-w-md">
                                                Key operational center in Colombo region.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between items-end gap-4 h-full border-l border-blue-200/50 pl-8">


                                        <div className="flex gap-8">
                                            <div className="text-center min-w-[80px]">
                                                <div className="flex items-center justify-center text-xs text-gray-500 mb-1">
                                                    <Users className="w-4 h-4 mr-1" /> Staff
                                                </div>
                                                <span className="text-3xl font-bold text-gray-900">{colomboCenter._count?.users || 0}</span>
                                            </div>
                                            <div className="text-center min-w-[80px]">
                                                <div className="flex items-center justify-center text-xs text-gray-500 mb-1">
                                                    <Box className="w-4 h-4 mr-1" /> Assets
                                                </div>
                                                <span className="text-3xl font-bold text-blue-600">{colomboCenter._count?.assets || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    )}
                </div>
            )}

            {/* Regional Branches Grid */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 px-1">Regional Branches</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regionalBranches?.map((branch: Branch) => (
                        <Link key={branch.id} to={`/branches/${branch.id}`} className="block group">
                            <Card className="p-6 hover:shadow-md transition-shadow h-full border border-gray-100 group-hover:border-indigo-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="success">Active</Badge>

                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{branch.name}</h3>
                                <div className="flex items-center text-gray-500 text-sm mb-6">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {branch.location}
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                    <div>
                                        <div className="flex items-center text-xs text-gray-500 mb-1">
                                            <Users className="w-3 h-3 mr-1" />
                                            Staff
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">{branch._count?.users || 0}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center text-xs text-gray-500 mb-1">
                                            <Box className="w-3 h-3 mr-1" />
                                            Assets
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">{branch._count?.assets || 0}</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}

                    {(!regionalBranches || regionalBranches.length === 0) && (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            <p>No regional branches found.</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Dialogs */}

        </div>
    );
};

export default Branches;
