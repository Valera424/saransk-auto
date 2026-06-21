"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingModal from "@/components/ui/BookingModal";
import LeasingCalculator from "@/components/ui/LeasingCalculator";
import YandexMap from "@/components/ui/YandexMap";

type Car = {
    id: string;
    brand: string;
    model: string;
    year: number;
    type: string;
    pricePerDay: number;
    leasePrice: number;
    imageUrl: string;
    isAvailable: boolean;
};

export default function CatalogPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [filter, setFilter] = useState("ALL");
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [bookingOpen, setBookingOpen] = useState(false);

    useEffect(() => {
        fetch("/api/cars")
            .then((res) => res.json())
            .then((data) => setCars(data))
            .catch(console.error);
    }, []);

    const filteredCars = cars.filter((car) => {
        if (filter === "ALL") return true;
        if (filter === "CARSHARE") return car.type === "CARSHARE" || car.type === "BOTH";
        if (filter === "LEASING") return car.type === "LEASING" || car.type === "BOTH";
        return true;
    });

    return (
        <>
            <Header />

            {/* Hero Section - светло-голубой */}
            <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                            Каршеринг и лизинг
                            <span className="block text-blue-600">в Саранске</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Современные автомобили, прозрачные условия, отличные цены
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <a
                                href="#catalog"
                                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
                            >
                                🚗 Выбрать авто
                            </a>
                            <a
                                href="#calculator"
                                className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all"
                            >
                                💰 Рассчитать лизинг
                            </a>
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* Преимущества */}
            <section id="about" className="py-20 px-6 bg-white">
                <Container>
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Почему выбирают нас</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: "🚗", title: "Современный автопарк", desc: "Только новые автомобили 2023-2024 года", color: "bg-blue-100" },
                            { icon: "💰", title: "Выгодные цены", desc: "От 2400 ₽/день без скрытых платежей", color: "bg-green-100" },
                            { icon: "🛡️", title: "Полная страховка", desc: "ОСАГО и КАСКО включены в стоимость", color: "bg-purple-100" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`card p-8 ${item.color}`}
                            >
                                <div className="text-5xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Каталог */}
            <section id="catalog" className="py-20 px-6 bg-gray-50">
                <Container>
                    <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Наш автопарк</h2>
                    <p className="text-center text-gray-600 mb-12">Выберите автомобиль под ваши задачи</p>

                    <div className="flex gap-3 justify-center mb-12">
                        {[
                            { value: "ALL", label: "Все авто" },
                            { value: "CARSHARE", label: "Каршеринг" },
                            { value: "LEASING", label: "Лизинг" },
                        ].map((item) => (
                            <button
                                key={item.value}
                                onClick={() => setFilter(item.value)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                                    filter === item.value
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCars.map((car, i) => (
                            <motion.div
                                key={car.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="card overflow-hidden"
                            >
                                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
                                    {car.imageUrl ? (
                                        <img src={car.imageUrl} alt={car.brand} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-6xl">🚗</div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600">
                                        {car.type === "CARSHARE" ? "Каршеринг" : car.type === "LEASING" ? "Лизинг" : "Оба"}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                                        {car.brand} {car.model}
                                    </h3>
                                    <p className="text-gray-500 mb-4">{car.year} год</p>

                                    <div className="space-y-2 mb-6">
                                        {(car.type === "CARSHARE" || car.type === "BOTH") && (
                                            <div className="text-2xl font-bold text-blue-600">
                                                {car.pricePerDay.toLocaleString()} ₽<span className="text-sm text-gray-500 font-normal">/день</span>
                                            </div>
                                        )}
                                        {(car.type === "LEASING" || car.type === "BOTH") && (
                                            <div className="text-sm text-gray-600">
                                                Лизинг: <span className="font-semibold">{car.leasePrice.toLocaleString()} ₽/мес</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => { setSelectedCar(car); setBookingOpen(true); }}
                                        disabled={!car.isAvailable}
                                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                    >
                                        {car.isAvailable ? "Забронировать" : "Недоступен"}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Калькулятор */}
            <section id="calculator" className="py-20 px-6 bg-white">
                <Container>
                    <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Калькулятор лизинга</h2>
                    <p className="text-center text-gray-600 mb-12">Рассчитайте ежемесячный платёж</p>
                    <div className="max-w-2xl mx-auto">
                        <LeasingCalculator />
                    </div>
                </Container>
            </section>

            {/* Карта */}
            <section id="map" className="py-20 px-6 bg-gray-50">
                <Container>
                    <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">📍 Где найти автомобиль</h2>
                    <p className="text-center text-gray-600 mb-12">Актуальное расположение машин в Саранске</p>
                    <YandexMap />
                </Container>
            </section>

            {/* FAQ */}
            <section className="py-20 px-6 bg-white">
                <Container>
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Частые вопросы</h2>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {[
                            { q: "Нужен ли залог?", a: "Для каршеринга залог не требуется. Для лизинга — первоначальный взнос от 10%." },
                            { q: "Что входит в стоимость?", a: "Страховка ОСАГО/КАСКО, техническое обслуживание, мойка после возврата." },
                            { q: "Можно ли выехать за город?", a: "Да, в радиусе 50 км от Саранска без дополнительной платы." },
                        ].map((faq, i) => (
                            <motion.details
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="card p-6"
                            >
                                <summary className="font-bold text-lg text-gray-800 list-none flex justify-between items-center cursor-pointer">
                                    {faq.q}
                                    <span className="text-blue-600 text-2xl">▼</span>
                                </summary>
                                <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
                            </motion.details>
                        ))}
                    </div>
                </Container>
            </section>

            <Footer />
            <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} car={selectedCar} />
        </>
    );
}