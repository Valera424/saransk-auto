"use client";
import { useState, useEffect } from "react";

export default function LeasingCalculator() {
    const [price, setPrice] = useState(2000000);
    const [downPayment, setDownPayment] = useState(20);
    const [term, setTerm] = useState(36);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        const loanAmount = price * (1 - downPayment / 100);
        const monthlyRate = 0.015; // 1.5% в месяц
        const x = Math.pow(1 + monthlyRate, term);
        const payment = (loanAmount * x * monthlyRate) / (x - 1);
        setMonthlyPayment(Math.round(payment));
    }, [price, downPayment, term]);

    const downPaymentAmount = Math.round(price * downPayment / 100);
    const loanAmount = Math.round(price * (1 - downPayment / 100));
    const totalPayment = monthlyPayment * term;
    const overpayment = totalPayment - loanAmount;

    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-xl">
            <h3 className="text-2xl font-bold text-[#0F172A] mb-6">Калькулятор лизинга</h3>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-[#475569]">Стоимость автомобиля</label>
                        <span className="text-sm font-bold text-[#0F172A]">{Number(price).toLocaleString()} ₽</span>
                    </div>
                    <input
                        type="range"
                        min="500000"
                        max="10000000"
                        step="100000"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-[#475569]">Первоначальный взнос</label>
                        <span className="text-sm font-bold text-[#0F172A]">{downPayment}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-[#475569]">Срок лизинга</label>
                        <span className="text-sm font-bold text-[#0F172A]">{term} мес.</span>
                    </div>
                    <input
                        type="range"
                        min="12"
                        max="60"
                        step="6"
                        value={term}
                        onChange={(e) => setTerm(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>


            </div>
            <div
                className="mt-8 p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl text-white shadow-xl">
                <div className="text-sm opacity-90 mb-2">Ежемесячный платёж</div>
                <div className="text-5xl font-bold mb-4">{monthlyPayment.toLocaleString()} ₽</div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-white/20 pb-2">
                        <span className="opacity-90">Первоначальный взнос:</span>
                        <span className="font-bold">{downPaymentAmount.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between border-b border-white/20 pb-2">
                        <span className="opacity-90">Сумма кредита:</span>
                        <span className="font-bold">{loanAmount.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="opacity-90">Переплата:</span>
                        <span className="font-bold">{overpayment.toLocaleString()} ₽</span>
                    </div>
                </div>
            </div>
        </div>
    );
}