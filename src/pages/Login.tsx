import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-800 via-gray-800 to-gray-900">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>
            {/* Animated Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-float" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-float-delayed" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
                <div className="backdrop-blur-2xl bg-cyan-400/10 border border-cyan-300/30 rounded-3xl shadow-2xl shadow-cyan-500/20 p-8 md:p-10 transform hover:scale-[1.01] transition-all duration-300">
                    {/* Logo/Brand Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-300/25 to-blue-400/15 rounded-2xl backdrop-blur-xl mb-4 animate-bounce-subtle border border-cyan-300/20">
                            <Sparkles className="w-8 h-8 text-cyan-100" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2 tracking-tight">
                            <span className="bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 bg-clip-text text-transparent">
                                GJRTI
                            </span>
                        </h1>
                        <p className="text-cyan-50 text-sm font-medium">eAsset Management System</p>
                        <p className="text-cyan-100/70 text-xs mt-1">Sign in to access your dashboard</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="w-5 h-5 text-cyan-200/60 group-focus-within:text-cyan-100 transition-colors" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-cyan-300/10 border border-cyan-300/30 rounded-xl text-cyan-50 placeholder-cyan-200/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 focus:border-cyan-300/50 backdrop-blur-xl transition-all duration-300 hover:bg-cyan-300/15"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="w-5 h-5 text-cyan-200/60 group-focus-within:text-cyan-100 transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                className="w-full pl-12 pr-12 py-3.5 bg-cyan-300/10 border border-cyan-300/30 rounded-xl text-cyan-50 placeholder-cyan-200/40 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 focus:border-cyan-300/50 backdrop-blur-xl transition-all duration-300 hover:bg-cyan-300/15"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-200/60 hover:text-cyan-100 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-400/20 border border-red-300/40 text-red-100 text-sm p-3 rounded-xl backdrop-blur-xl animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                            style={{
                                background: 'linear-gradient(135deg, rgba(103, 232, 249, 0.95) 0%, rgba(34, 211, 238, 0.90) 100%)',
                                color: '#0c4a6e'
                            }}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </form>

                    {/* Footer Text */}
                    <div className="mt-6 text-center">
                        <p className="text-cyan-100/60 text-xs">
                            Secured with enterprise-grade encryption
                        </p>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(-20px) translateX(10px); }
                    66% { transform: translateY(-10px) translateX(-10px); }
                }
                
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    33% { transform: translateY(20px) translateX(-15px); }
                    66% { transform: translateY(10px) translateX(15px); }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                }
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                
                .animate-float {
                    animation: float 20s ease-in-out infinite;
                }
                
                .animate-float-delayed {
                    animation: float-delayed 25s ease-in-out infinite;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
                
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Login;
