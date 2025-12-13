import { Card, Badge } from '../components/ui';
import { Github, Mail, Linkedin, Globe, Code2, Server, Database } from 'lucide-react';

const Developer = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-gradient sm:text-5xl mb-4">
                    Meet the Developer
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    The mind behind the GJRTI Asset Management System. Dedicated to building robust, scalable, and user-friendly solutions.
                </p>
            </div>

            <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <div className="md:flex">
                    <div className="md:w-2/5 p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                        <div className="relative">
                            <div className="w-48 h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white flex items-center justify-center">
                                {/* Placeholder for Developer Photo - User can replace src */}
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Developer&backgroundColor=b6e3f4"
                                    alt="Developer"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute bottom-2 right-4 bg-white rounded-full p-2 shadow-lg">
                                <Code2 className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>
                    <div className="p-8 md:w-3/5 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge variant="success">Full Stack Developer</Badge>
                            <Badge variant="default">System Architect</Badge>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Satkunanathan Sutharshan</h2>
                        <p className="text-gray-500 mb-6 font-medium">ICT Officer - GJRTI</p>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Designed and developed the complete end-to-end architecture of the GJRTI Asset Management System.
                            From the robust Node.js/Prisma backend to the responsive React frontend, this system streamlines asset tracking,
                            branch management, and inter-branch transfers with a focus on data integrity, user experience, and operational efficiency.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Code2 className="w-4 h-4 text-indigo-500" />
                                <span>React & TypeScript</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Server className="w-4 h-4 text-indigo-500" />
                                <span>Node.js & Express</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Database className="w-4 h-4 text-indigo-500" />
                                <span>Prisma & SQL</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Globe className="w-4 h-4 text-indigo-500" />
                                <span>Web Architecture</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Developer;
