import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Box, ArrowRightLeft, Building2, Users, LogOut, Menu, X, KeyRound } from 'lucide-react';
import { clsx } from 'clsx';
import { Dialog, DialogContent, DialogTrigger } from './ui/Dialog';
import ChangePassword from './ChangePassword';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Responsive Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setIsSidebarOpen(true);
            else setIsSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close sidebar on route change for mobile
    useEffect(() => {
        if (isMobile) setIsSidebarOpen(false);
    }, [location.pathname, isMobile]);

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Assets', path: '/assets', icon: Box },
        { label: 'Transfers', path: '/transfers', icon: ArrowRightLeft },
        { label: 'Branches', path: '/branches', icon: Building2 },
    ];

    if (user?.role === 'SUPER_ADMIN') {
        navItems.push({ label: 'Users', path: '/users', icon: Users });
    }

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-40 flex items-center justify-between px-4 shadow-md">
                <span className="font-bold text-xl tracking-tight text-blue-400">AssetManager</span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Backdrop for Mobile */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none",
                    isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"
                )}
            >
                {/* Desktop Header Logo */}
                <div className="h-16 hidden lg:flex items-center justify-between px-6 border-b border-slate-800">
                    {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-blue-400">AssetManager</span>}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded hidden lg:block">
                        <Menu className="w-6 h-6 text-gray-400 hover:text-white" />
                    </button>
                </div>

                {/* Mobile Sidebar Header (Empty just to push content down roughly) */}
                <div className="h-16 lg:hidden flex items-center px-6 border-b border-slate-800">
                    <span className="font-bold text-xl tracking-tight text-blue-400">Menu</span>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={clsx(
                                            "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group",
                                            isActive
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                                : "text-gray-400 hover:bg-slate-800 hover:text-white"
                                        )}
                                    >
                                        <Icon className={clsx("w-5 h-5 min-w-[20px]", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                                        <span className={clsx("font-medium transition-opacity duration-200 whitespace-nowrap", !isSidebarOpen && !isMobile ? "lg:opacity-0 lg:hidden" : "opacity-100")}>
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 min-w-[32px] rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        {(isSidebarOpen || isMobile) && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.role}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                            <DialogTrigger asChild>
                                <button
                                    className={clsx(
                                        "flex-1 flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-400 hover:bg-cyan-950/30 hover:text-cyan-300 rounded-lg transition-colors",
                                        (!isSidebarOpen && !isMobile) ? "justify-center px-2" : "justify-start"
                                    )}
                                >
                                    <KeyRound className="w-5 h-5 min-w-[20px]" />
                                    {(isSidebarOpen || isMobile) && <span>Change Password</span>}
                                </button>
                            </DialogTrigger>
                            <DialogContent title="Change Password">
                                <ChangePassword
                                    onSuccess={() => {
                                        setIsPasswordModalOpen(false);
                                        alert('Password changed successfully!');
                                    }}
                                    onCancel={() => setIsPasswordModalOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <button
                        onClick={logout}
                        className={clsx(
                            "w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors",
                            (!isSidebarOpen && !isMobile) ? "justify-center px-2" : "justify-start"
                        )}
                    >
                        <LogOut className="w-5 h-5 min-w-[20px]" />
                        {(isSidebarOpen || isMobile) && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full pt-16 lg:pt-0">
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
