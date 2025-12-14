import { Mail, Phone } from 'lucide-react';
import { Card } from '../components/ui';

const developers = [
    {
        name: 'Satkunanathan Sutharshan',
        role: 'System Assistant (ICT)',
        specialty: 'System Architecture & Core Logic',
        image: '/sutharshan.jpg',
        email: 'sutharshankanna04@gmail.com',
        phone: '071 774 4341 | 075 434 7886',
        description: 'Innovative lead developer responsible for the overall system architecture, backend API design, and core business logic implementation.'
    },
    {
        name: 'Pasindu Madushan Liyanage',
        role: 'Technical Officer',
        specialty: 'Technical Operations',
        // icon: <LayoutTemplate className="w-8 h-8 text-green-500" />,
        image: '/pasindu.jpg',
        email: 'pasimcg@gmail.com',
        phone: '071-5850998',
        description: 'Technical oversight and operational support for the asset management workflows.'
    },
    {
        name: 'Narmada Wijerathna',
        role: 'Audit Assistant',
        specialty: 'Audit & Compliance',
        // icon: <Database className="w-8 h-8 text-pink-500" />,
        image: '/narmada.png',
        email: 'narmadaannk@gmail.com',
        phone: '0774951061',
        description: 'Ensuring data accuracy, compliance, and assisting with audit processes.'
    }
];

const DevTeam = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Development Team
                </h1>
                <p className="text-lg text-gray-600">
                    The creative minds behind the GJRTI Asset Management System.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                {developers.map((dev: any, index) => (
                    <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-t-indigo-500 group">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-300">
                                {dev.image ? (
                                    <img src={dev.image} alt={dev.name} className="w-full h-full object-cover object-top" />
                                ) : (
                                    dev.icon
                                )}
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{dev.name}</h3>
                                <p className="text-sm font-medium text-indigo-600">{dev.role}</p>
                            </div>

                            <p className="text-gray-500 text-sm leading-relaxed">
                                {dev.description}
                            </p>

                            <div className="pt-4 w-full space-y-2">
                                {dev.email && (
                                    <div className="flex items-center justify-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                                        <Mail className="w-4 h-4" />
                                        <a href={`mailto:${dev.email}`} className="text-sm">{dev.email}</a>
                                    </div>
                                )}
                                {dev.phone && (
                                    <div className="flex items-center justify-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                                        <Phone className="w-4 h-4" />
                                        <div className="flex flex-col md:flex-row gap-1 md:gap-3 text-sm">
                                            {dev.phone.split('|').map((num: string, i: number) => (
                                                <a key={i} href={`tel:${num.trim()}`} className="hover:underline">{num.trim()}</a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default DevTeam;
