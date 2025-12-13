
import { useQuery } from '@tanstack/react-query';
import { getBranches, type Branch } from '../api/branches';
import { Card, Badge } from '../components/ui';
import { Building2, MapPin, Users, Box } from 'lucide-react';
import { Link } from 'react-router-dom';

const Branches = () => {
    const { data: branches, isLoading } = useQuery({ queryKey: ['branches'], queryFn: getBranches });

    const headOffice = branches?.find((b: Branch) => b.name === 'Head Office');
    const regionalBranches = branches?.filter((b: Branch) => b.name !== 'Head Office');

    if (isLoading) return <div className="p-8">Loading branches...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Branches Overview</h1>
                <p className="text-gray-500 mt-1">Manage Head Office and Regional Branch assets.</p>
            </div>

            {/* Head Office Section */}
            {headOffice && (
                <div className="animate-fade-in-up">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 px-1">Head Office</h2>
                    <Link to={`/branches/${headOffice.id}`} className="block group">
                        <Card className="p-8 border-l-4 border-l-indigo-500 hover:shadow-lg transition-all bg-gradient-to-r from-white to-blue-50/30">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {headOffice.name}
                                            </h3>
                                            <span className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                                Main Hub
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-500 mb-2">
                                            <MapPin className="w-4 h-4 mr-1.5" />
                                            {headOffice.location}
                                        </div>
                                        <p className="text-sm text-gray-400 max-w-md">
                                            Central administration and main asset repository.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-8 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
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
                                        <span className="text-3xl font-bold text-indigo-600">{headOffice._count?.assets || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
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
                                    <Badge variant="success">Active</Badge>
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
        </div>
    );
};

export default Branches;
