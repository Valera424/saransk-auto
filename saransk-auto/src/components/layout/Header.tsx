"use client";
import { useState, useEffect } from "react";
import Container from "./Container";
import AuthModal from "../ui/AuthModal";

export default function Header() {
    const [authOpen, setAuthOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("auth_user");
        if (stored) setUser(JSON.parse(stored));

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        setUser(null);
        window.location.reload();
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? "bg-white shadow-lg" : "bg-white/95"
            }`}>
                <div className="w-full">
                    <Container>
                        <div className="flex items-center justify-between h-16">
                            {/* Логотип */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white text-xl">🚗</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">Saransk Auto</h1>
                                    <p className="text-xs text-gray-500">Каршеринг и лизинг</p>
                                </div>
                            </div>

                            {/* Навигация */}
                            <nav className="hidden md:flex items-center gap-8">
                                <a href="#about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">О нас</a>
                                <a href="#catalog" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Каталог</a>
                                <a href="#calculator" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Лизинг</a>
                                <a href="#map" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Карта</a>
                                <a href="#contacts" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Контакты</a>
                            </nav>

                            {/* Кнопка входа */}
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Выйти
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setAuthOpen(true)}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    Войти
                                </button>
                            )}
                        </div>
                    </Container>
                </div>
            </header>

            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    );
}