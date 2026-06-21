import Container from "./Container";

export default function Footer() {
    return (
        <footer id="contacts" className="bg-[#0F172A] text-white py-16 px-6">
            <Container>
                <div className="grid md:grid-cols-3 gap-12 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg" />
                            <span className="text-xl font-bold">Saransk Auto</span>
                        </div>
                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                            Современный сервис каршеринга и лизинга автомобилей в Саранске.
                            Надёжные автомобили, прозрачные условия, отличное обслуживание.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Контакты</h4>
                        <div className="space-y-3 text-sm text-[#94A3B8]">
                            <div className="flex items-start gap-3">
                                <span className="text-lg">📍</span>
                                <div>
                                    <div className="font-medium text-white">Адрес</div>
                                    <div>г. Саранск, ул. Примерная, 123</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-lg">📞</span>
                                <div>
                                    <div className="font-medium text-white">Телефон</div>
                                    <div>+7 (8342) 00-00-00</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-lg">✉️</span>
                                <div>
                                    <div className="font-medium text-white">Email</div>
                                    <div>info@saransk-auto.ru</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Режим работы</h4>
                        <div className="space-y-2 text-sm text-[#94A3B8]">
                            <div className="flex justify-between">
                                <span>Пн-Пт:</span>
                                <span className="text-white">9:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Сб:</span>
                                <span className="text-white">10:00 - 15:00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Вс:</span>
                                <span className="text-white">Выходной</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 text-center text-sm text-[#64748B]">
                    © 2026 Saransk Auto. Дипломный проект. Все права защищены.
                </div>
            </Container>
        </footer>
    );
}