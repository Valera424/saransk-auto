"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthModal({
                                      isOpen,
                                      onClose
                                  }: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);

        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            if (isLogin) {
                localStorage.setItem("auth_token", data.token);
                localStorage.setItem("auth_user", JSON.stringify(data.user));
            }
            onClose();
            window.location.reload();
        } catch (err: any) {
            setError(err.message || "Произошла ошибка");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden pointer-events-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[#0F172A]">
                                        {isLogin ? "Вход" : "Регистрация"}
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 text-2xl"
                                    >
                                        &times;
                                    </button>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {!isLogin && (
                                        <input
                                            name="name"
                                            required
                                            placeholder="Имя"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    )}
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="Email"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    {!isLogin && (
                                        <input
                                            name="phone"
                                            required
                                            placeholder="Телефон"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    )}
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="Пароль"
                                        className="w-full px-4 py-3


ounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 bg-[#0F172A] text-white rounded-xl font-semibold hover:bg-[#1E293B] transition-colors disabled:opacity-70"
                                    >
                                        {loading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
                                    </button>
                                </form>

                                <div className="mt-4 text-center text-sm text-[#64748B]">
                                    {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
                                    <button
                                        onClick={() => { setIsLogin(!isLogin); setError(""); }}
                                        className="text-blue-600 font-semibold hover:underline"
                                    >
                                        {isLogin ? "Создать" : "Войти"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
