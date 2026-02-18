import React, { useState, useEffect } from 'react';
import {
    Users as UsersIcon,
    Bike as BikeIcon,
    Calendar,
    Settings,
    LogOut,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    Plus,
    Search,
    ChevronRight,
    Edit2,
    Trash2,
    Package,
    Eye,
    User as UserIcon,
    CalendarDays,
    ShieldAlert
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Bike } from '../../types';
import AddBikeModal from './AddBikeModal';

interface AdminDashboardProps {
    onLogout: () => void;
}

type Tab = 'Overview' | 'Inventory' | 'Reservations' | 'Users' | 'Settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('Overview');
    const [bikes, setBikes] = useState<Bike[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBike, setSelectedBike] = useState<Bike | null>(null);

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBikes: 0,
        totalBookings: 0,
        activeBookings: 0
    });

    const fetchBikes = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:4000/api/home');
            const data = await res.json();
            setBikes(data);
            setStats(prev => ({ ...prev, totalBikes: data.length }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/api/booking/all', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setBookings(data);
            setStats(prev => ({
                ...prev,
                totalBookings: data.length,
                activeBookings: data.filter((b: any) => b.status === 'confirmed').length
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
                setStats(prev => ({ ...prev, totalUsers: data.length }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4000/api/booking/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchBookings();
                fetchBikes();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4000/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || "Une erreur est survenue");
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBikes();
        fetchBookings();
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Etes-vous sûr de vouloir supprimer ce vélo?')) return;
        try {
            const res = await fetch(`http://localhost:4000/api/deleteBike/${id}`, { method: 'DELETE' });
            if (res.ok) fetchBikes();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (bike: Bike) => {
        setSelectedBike(bike);
        setIsModalOpen(true);
    };

    const handleDownloadReport = () => {
        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();

        // Title
        doc.setFontSize(22);
        doc.setTextColor(22, 163, 74); // Green color
        doc.text("GreenBike Platform Report", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${timestamp}`, 14, 28);

        // Stats Section
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Platform Statistics", 14, 40);

        autoTable(doc, {
            startY: 45,
            head: [['Total Users', 'Total Bikes', 'Total Sales', 'Live Orders']],
            body: [[stats.totalUsers, stats.totalBikes, stats.totalBookings, stats.activeBookings]],
            theme: 'striped',
            headStyles: { fillColor: [22, 163, 74] }
        });

        // Inventory Section
        const finalY1 = (doc as any).lastAutoTable.finalY + 15;
        doc.text("Fleet Inventory", 14, finalY1);

        autoTable(doc, {
            startY: finalY1 + 5,
            head: [['ID', 'Name', 'Type', 'Price ($)', 'Status']],
            body: bikes.map(b => [
                b.id || 'N/A',
                b.nom,
                b.type,
                b.prix,
                b.available !== false ? 'Available' : 'Booked'
            ]),
            headStyles: { fillColor: [31, 41, 55] }
        });

        // Reservations Section (New Page if needed)
        doc.addPage();
        doc.text("Customer Reservations", 14, 20);

        autoTable(doc, {
            startY: 25,
            head: [['Customer', 'Bike', 'Dates', 'Status']],
            body: bookings.map(res => [
                res.user?.nom || 'Anonymous',
                res.bike?.nom || 'N/A',
                `${new Date(res.startDate).toLocaleDateString()} - ${new Date(res.endDate).toLocaleDateString()}`,
                res.status
            ]),
            headStyles: { fillColor: [37, 99, 235] }
        });

        // Users Section
        const finalY3 = (doc as any).lastAutoTable.finalY + 15;
        doc.text("Registered Users", 14, finalY3);

        autoTable(doc, {
            startY: finalY3 + 5,
            head: [['Name', 'Email', 'Role', 'Age', 'Gender']],
            body: users.map(u => [
                u.nom,
                u.email,
                u.role,
                u.age || 'N/A',
                u.gender || 'N/A'
            ]),
            headStyles: { fillColor: [147, 51, 234] }
        });

        doc.save(`GreenBike_Admin_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const menuItems = [
        { icon: <TrendingUp className="w-5 h-5" />, label: 'Overview' as Tab },
        { icon: <BikeIcon className="w-5 h-5" />, label: 'Inventory' as Tab },
        { icon: <Calendar className="w-5 h-5" />, label: 'Reservations' as Tab },
        { icon: <UsersIcon className="w-5 h-5" />, label: 'Users' as Tab },
        { icon: <Settings className="w-5 h-5" />, label: 'Settings' as Tab },
    ];

    const API_URL = 'http://localhost:4000';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full shadow-sm z-[90]">
                <div className="p-6 flex items-center gap-3 border-b border-gray-50">
                    <div className="bg-green-600 p-2 rounded-xl">
                        <BikeIcon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-black text-gray-900 tracking-tight">Admin<span className="text-green-600">Hub</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-1 mt-4">
                    {menuItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => typeof item.label === 'string' && ['Overview', 'Inventory', 'Reservations', 'Users', 'Settings'].includes(item.label) && setActiveTab(item.label as Tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === item.label
                                ? 'bg-green-50 text-green-700 shadow-sm border border-green-100/50'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-50">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-10">
                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight tracking-tight">Bonjour, Admin 👋</h1>
                        <p className="text-gray-500 mt-1 font-medium italic underline decoration-green-300 underline-offset-4 tracking-tight">Manage your platform with precision.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none w-64 shadow-sm transition-all"
                            />
                        </div>
                        <button
                            onClick={() => { setSelectedBike(null); setIsModalOpen(true); }}
                            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition-all shadow-lg flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Bike
                        </button>
                    </div>
                </header>

                {activeTab === 'Overview' ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {[
                                { label: 'Total Users', value: stats.totalUsers, color: 'blue', icon: <UsersIcon /> },
                                { label: 'Total Bikes', value: stats.totalBikes, color: 'green', icon: <BikeIcon /> },
                                { label: 'Total Sales', value: stats.totalBookings, color: 'purple', icon: <TrendingUp /> },
                                { label: 'Live Orders', value: stats.activeBookings, color: 'orange', icon: <Clock /> },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-50 flex items-center gap-5 group hover:scale-105 transition-transform duration-300 cursor-pointer text-left">
                                    <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl group-hover:bg-${stat.color}-600 group-hover:text-white transition-colors duration-300`}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                        <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
                                    <h3 className="font-black text-gray-900 text-lg">Recent Operations</h3>
                                    <button
                                        onClick={() => setActiveTab('Reservations')}
                                        className="text-green-600 text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1"
                                    >
                                        View All <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="divide-y divide-gray-50 text-left">
                                    {bookings.slice(0, 5).map((booking, idx) => (
                                        <div key={idx} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4 text-left">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 uppercase">
                                                    {booking.user?.nom?.charAt(0) || 'U'}
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-gray-900">{booking.user?.nom || 'Anonymous'}</p>
                                                    <p className="text-xs text-gray-500 font-medium">{booking.bike?.nom || 'Unknown Bike'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-8">
                                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${booking.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                                                    booking.status === 'pending' ? 'bg-blue-50 text-blue-700' :
                                                        'bg-red-50 text-red-700'
                                                    }`}>
                                                    {booking.status}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl h-fit text-left">
                                <h3 className="text-xl font-bold mb-6">Inventory Summary</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 font-medium text-sm italic">Available Now</span>
                                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-black">{bikes.filter(b => b.available !== false).length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 font-medium text-sm italic">Currently Rented</span>
                                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-black">{bikes.filter(b => b.available === false).length}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDownloadReport}
                                    className="mt-10 w-full py-4 bg-white/5 border border-white/10 hover:bg-white hover:text-gray-900 transition-all text-xs font-black uppercase tracking-widest rounded-2xl"
                                >
                                    Download Report
                                </button>
                            </div>
                        </div>
                    </>
                ) : activeTab === 'Inventory' ? (
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center text-left">
                            <div className="flex items-center gap-3 text-left">
                                <div className="p-3 bg-gray-900 text-white rounded-2xl">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-xl tracking-tight">Bike Fleet</h3>
                                    <p className="text-xs text-gray-500 font-medium">Manage Pricing & Availability.</p>
                                </div>
                            </div>
                            <span className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-black uppercase border border-gray-100 italic">
                                {bikes.length} Units
                            </span>
                        </div>

                        <div className="overflow-x-auto text-left">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-50">
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic">Bike Details</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic">Attributes</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic text-left">Daily Rate</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic">Status</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-left">
                                    {bikes.map((bike) => (
                                        <tr key={bike._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6 text-left">
                                                <div className="flex items-center gap-5">
                                                    <img
                                                        src={`${API_URL}/uploads/${bike.images?.[0]}`}
                                                        alt={bike.nom}
                                                        className="w-16 h-16 rounded-2xl object-cover bg-gray-100 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform"
                                                    />
                                                    <div>
                                                        <p className="font-black text-gray-900 text-base">{bike.nom}</p>
                                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">REF: {bike.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-2">
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-black uppercase w-fit tracking-wider">
                                                        {bike.type}
                                                    </span>
                                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-black uppercase w-fit tracking-wider italic">
                                                        {(bike as any).taille || 'Moyenne'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-lg font-black text-green-600">
                                                ${bike.prix}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${bike.available !== false
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-red-50 text-red-700 border-red-100'
                                                    }`}>
                                                    {bike.available !== false ? 'Available' : 'Booked'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                                    <button onClick={() => handleEdit(bike)} className="p-3 bg-white text-blue-600 rounded-xl shadow-lg border border-gray-100 hover:bg-blue-600 hover:text-white transition-all">
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(bike._id!)} className="p-3 bg-white text-red-600 rounded-xl shadow-lg border border-gray-100 hover:bg-red-600 hover:text-white transition-all">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === 'Reservations' ? (
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center text-left">
                            <div className="flex items-center gap-3 text-left">
                                <div className="p-3 bg-green-600 text-white rounded-2xl">
                                    <CalendarDays className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-black text-gray-900 text-xl tracking-tight">Booking Requests</h3>
                                    <p className="text-xs text-gray-500 font-medium italic underline decoration-blue-200">Confirm or Cancel customer reservations.</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto text-left">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-50">
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic">Customer</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic">Reserved Bike</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic">Duration</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic">Status</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {bookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6 text-left">
                                                <div className="flex items-center gap-4 text-left">
                                                    <div className="p-3 bg-gray-100 rounded-2xl text-gray-500">
                                                        <UserIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-black text-gray-900">{booking.user?.nom || 'Anonymous'}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold italic tracking-tight">{booking.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-bold text-gray-700">
                                                {booking.bike?.nom || 'Deleted Bike'}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-xs font-bold text-gray-500 space-y-1">
                                                    <p className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(booking.startDate).toLocaleDateString()}</p>
                                                    <p className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-green-400" /> {new Date(booking.endDate).toLocaleDateString()}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100 shadow-green-100/50' :
                                                    booking.status === 'pending' ? 'bg-blue-50 text-blue-700 border-blue-100 shadow-blue-100/50' :
                                                        'bg-red-50 text-red-700 border-red-100 shadow-red-100/50'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {booking.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                                                                className="px-4 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all font-bold"
                                                            >
                                                                Confirmer
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                                                                className="px-4 py-2 bg-white text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 border border-red-100 transition-all font-bold"
                                                            >
                                                                Annuler
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : activeTab === 'Users' ? (
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center text-left">
                            <div className="flex items-center gap-3 text-left">
                                <div className="p-3 bg-blue-600 text-white rounded-2xl">
                                    <UsersIcon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-black text-gray-900 text-xl tracking-tight">Registered Users</h3>
                                    <p className="text-xs text-gray-500 font-medium italic underline decoration-blue-200">Manage customer accounts.</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto text-left">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-50">
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic">Name & Email</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic">Role</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic">Age & Gender</th>
                                        <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest italic text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6 text-left">
                                                <div className="flex items-center gap-4 text-left">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 uppercase">
                                                        {user.nom?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-black text-gray-900">{user.nom}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold italic tracking-tight">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${user.role === 'admin'
                                                    ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                    : 'bg-blue-50 text-blue-700 border-blue-100'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    {user.age || 'N/A'} YRS / {user.gender || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="p-3 bg-white text-red-600 rounded-xl shadow-lg border border-gray-100 hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                                                    >
                                                        <Trash2 className="w-5 h-5 font-bold" />
                                                    </button>
                                                )}
                                                {user.role === 'admin' && (
                                                    <div className="p-3 text-gray-300">
                                                        <ShieldAlert className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Settings View */
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500 text-left">
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 p-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-gray-900 text-white rounded-3xl">
                                    <Settings className="w-8 h-8" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-black text-gray-900 text-2xl tracking-tight">System Settings</h3>
                                    <p className="text-gray-400 font-medium text-sm italic">Manage global preferences and security.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic block">General Info</label>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-sm font-bold text-gray-700">Service Name</span>
                                            <input type="text" defaultValue="GreenBike Rentals" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-sm font-bold text-gray-700">Official Email</span>
                                            <input type="email" defaultValue="admin@greenbike.dz" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest italic block">Platform Status</label>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors">
                                            <div className="text-left">
                                                <p className="font-bold text-gray-900">Maintenance Mode</p>
                                                <p className="text-[10px] text-gray-400 font-medium italic">Disable public access temporarily.</p>
                                            </div>
                                            <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-5 bg-green-50 rounded-2xl border border-green-100 italic font-black text-green-700 text-xs text-center justify-center">
                                            System Status: All Systems Operational ✅
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-10 border-t border-gray-50 flex justify-end gap-4">
                                <button className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Cancel</button>
                                <button className="px-8 py-4 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-700 shadow-xl shadow-green-100 transition-all font-bold">Save Changes</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: <ShieldAlert className="w-8 h-8 text-red-500" />, title: 'Security Audit', desc: 'Manage password complexity and multi-factor authentication requirements.' },
                                { icon: <Clock className="w-8 h-8 text-blue-500" />, title: 'Cron Tasks', desc: 'Configure automated cleaning of expired tokens and temporary booking data.' },
                                { icon: <TrendingUp className="w-8 h-8 text-purple-500" />, title: 'API Configuration', desc: 'Manage webhooks and external data provider integrations globally.' },
                            ].map((card, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-lg shadow-gray-200/40 text-left flex flex-col items-start">
                                    <div className="mb-4">{card.icon}</div>
                                    <h4 className="font-black text-gray-900 mb-2">{card.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{card.desc}</p>
                                    <button className="mt-6 text-green-600 font-black text-[10px] uppercase tracking-widest hover:underline italic">Configure →</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <AddBikeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchBikes}
                    editBike={selectedBike}
                />
            </main>
        </div>
    );
};

export default AdminDashboard;
