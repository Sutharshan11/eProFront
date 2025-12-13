import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card } from './ui';

interface DashboardChartsProps {
    data: {
        assetsByCategory: { name: string, value: number }[];
        assetsByStatus: { name: string, value: number }[];
        assetsValueByBranch: { name: string, value: number }[];
    }
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DashboardCharts = ({ data }: DashboardChartsProps) => {

    // Custom Tooltip for better aesthetics
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg">
                    <p className="text-sm font-semibold text-slate-900">{label}</p>
                    <p className="text-sm text-indigo-600">
                        {payload[0].value.toLocaleString()}
                        {payload[0].name === 'Value (LKR)' ? '' : ' Items'}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Assets by Category */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Assets by Category</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.assetsByCategory}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                            <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Assets by Status */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Assets by Status</h3>
                <div className="h-[300px] w-full flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.assetsByStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.assetsByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Top 5 Branches by Asset Value */}
            <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Top Branches by Asset Value (LKR)</h3>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.assetsValueByBranch} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                formatter={(value: number) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value)}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} background={{ fill: '#f1f5f9' }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default DashboardCharts;
