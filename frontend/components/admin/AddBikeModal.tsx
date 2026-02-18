import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Bike } from '../../types';

interface AddBikeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editBike?: Bike | null;
}

const AddBikeModal: React.FC<AddBikeModalProps> = ({ isOpen, onClose, onSuccess, editBike }) => {
    const [formData, setForm] = useState({
        id: editBike?.id || Date.now(),
        nom: editBike?.nom || '',
        prix: editBike?.prix || '',
        type: editBike?.type || 'City',
        taille: (editBike as any)?.taille || 'Moyenne',
        available: editBike?.available !== undefined ? editBike.available : true
    });
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const url = editBike
            ? `http://localhost:4000/api/updateBike/${editBike._id}`
            : 'http://localhost:4000/api/addBike';

        const method = editBike ? 'PUT' : 'POST';

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value.toString());
            });

            if (!editBike) {
                images.forEach(image => {
                    data.append('images', image);
                });
            }

            const res = await fetch(url, {
                method,
                // When using FormData, fetch sets the correct content-type with boundary automatically
                body: editBike ? JSON.stringify(formData) : data,
                headers: editBike ? { 'Content-Type': 'application/json' } : {}
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const errorData = await res.json();
                setError(errorData.message || errorData.error || 'Operation failed');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-2xl font-black text-gray-900">{editBike ? 'Edit Bike' : 'Add New Bike'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</div>}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Bike Name</label>
                            <input
                                type="text" required value={formData.nom}
                                onChange={e => setForm({ ...formData, nom: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Ex: Rockrider ST 540"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Price (DH/Day)</label>
                            <input
                                type="number" required value={formData.prix}
                                onChange={e => setForm({ ...formData, prix: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setForm({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
                            >
                                <option value="City">City</option>
                                <option value="Electric">Electric</option>
                                <option value="Vtt">VTT</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Taille</label>
                            <select
                                value={formData.taille}
                                onChange={e => setForm({ ...formData, taille: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
                            >
                                <option value="Grand">Grand</option>
                                <option value="Moyenne">Moyenne</option>
                                <option value="petit">Petit</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Status</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setForm({ ...formData, available: true })}
                                className={`flex-1 py-3 rounded-xl border font-bold transition-all ${formData.available ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-100' : 'bg-white text-gray-500 border-gray-200 hover:border-green-500'}`}
                            >
                                Available
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({ ...formData, available: false })}
                                className={`flex-1 py-3 rounded-xl border font-bold transition-all ${!formData.available ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-100' : 'bg-white text-gray-500 border-gray-200 hover:border-red-500'}`}
                            >
                                Booked
                            </button>
                        </div>
                    </div>

                    {!editBike && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Bike Images (Max 5)</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-green-500 transition-colors cursor-pointer relative">
                                <input
                                    type="file" multiple accept="image/*"
                                    onChange={e => setImages(Array.from(e.target.files || []))}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <Upload className="w-10 h-10 text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500 font-medium">Click to upload or drag & drop</p>
                                {images.length > 0 && (
                                    <div className="mt-4 flex gap-2 flex-wrap">
                                        {images.map((img, i) => (
                                            <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">{img.name}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50">Cancel</button>
                        <button
                            type="submit" disabled={loading}
                            className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-green-600 shadow-xl transition-all disabled:bg-gray-300"
                        >
                            {loading ? 'Processing...' : editBike ? 'Update Bike' : 'Add Bike'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBikeModal;
