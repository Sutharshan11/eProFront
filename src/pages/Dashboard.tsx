
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/dashboard';
import { useAuth } from '../context/AuthContext';
import DashboardCharts from '../components/DashboardCharts';

const Dashboard = () => {
    const { user } = useAuth();
    const { data: stats, isLoading } = useQuery({ queryKey: ['dashboardStats'], queryFn: getDashboardStats });

    if (isLoading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="pb-10">
            <div className="mb-8 animate-fade-in-up">
                <h1 className="text-4xl font-extrabold tracking-tight text-gradient sm:text-5xl mb-2">
                    GJRTI Assets Dashboard
                </h1>
                <p className="text-gray-600 text-lg">
                    Welcome back, <span className="font-semibold text-gray-900">{user?.name}</span>. Here's what's happening today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Assets</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900">{stats?.totalAssets || 0}</p>
                        <span className="text-sm text-green-600 font-medium">Active</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Transfers</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900">{stats?.pendingTransfers || 0}</p>
                        {stats?.pendingTransfers > 0 && <span className="text-sm text-orange-500 font-medium">Action Required</span>}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Branches</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-gray-900">{stats?.totalBranches || 0}</p>
                        <span className="text-sm text-gray-500 font-medium">Total locations</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            {stats?.charts && <DashboardCharts data={stats.charts} />}
        </div>
    );
};

export default Dashboard;
