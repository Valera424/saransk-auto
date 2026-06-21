"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Car = {
    id: string;
    brand: string;
    model: string;
    pricePerDay: number;
    type: string;
};

export default function BookingModal({
                                         isOpen,
                                         onClose,
                                         car
                                     }: {
    isOpen: boolean;
    onClose: () => void;
    car: Car | null;
}) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const token = localStorage.getItem("auth_token");
        if (!token) {
            setError("Сначала войдите в аккаунт");
            setLoading(false);
            return;
        }

        const formData = new FormData(e.currentTarget);
        const startDate = new Date(formData.get("startDate") as string);
        const endDate = new Date(formData.get("endDate") as string);

        if (endDate <= startDate) {
            setError("Дата окончания должна быть позже даты начала");
            setLoading(false);
            return;
        }

        const diffDays = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
        const totalAmount = diffDays * (car?.pricePerDay || 0);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // ✅ Исправлено
                },
                body: JSON.stringify({
                    carId: car?.id,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    totalAmount
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Ошибка при бронировании");

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setError("");
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!car) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden pointer-events-auto">
                            {success ? (
                                <div className="p-12 text-center">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Бронирование успешно!</h3>
                                    <p className="text-[#64748B]">Мы свяжемся с вами в ближайшее время</p>
                                </div>
                            ) : (
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-[#0F172A]">Бронирование</h3>
                                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                                    </div>

                                    <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                                        <div className="text-lg font-bold text-[#0F172A]">{car.brand} {car.model}</div>
                                        <div className="text-sm text-[#64748B] mt-1">{car.type === "CARSHARE" ? "Каршеринг" : car.type === "LEASING" ? "Лизинг" : "Каршеринг + Лизинг"}</div>
                                        <div className="text-xl font-bold text-blue-600 mt-2">{car.pricePerDay.toLocaleString()} ₽/день</div>
                                    </div>

                                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">⚠️ {error}</div>}

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#475569] mb-2">Дата начала</label>
                                            <input name="startDate" type="date" required min={new Date().toISOString().split("T")[0]} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#475569] mb-2">Дата окончания</label>
                                            <input name="endDate" type="date" required min={new Date().toISOString().split("T")[0]} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#0F172A] text-white rounded-xl font-semibold hover:bg-[#1E293B] transition-all disabled:opacity-70">
                                            {loading ? "Обработка..." : "Подтвердить бронирование"}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}