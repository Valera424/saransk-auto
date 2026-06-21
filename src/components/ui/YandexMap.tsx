"use client";
import { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        ymaps: any;
    }
}

type Car = {
    id: string;
    brand: string;
    model: string;
    year: number;
    type: string;
    pricePerDay: number;
    leasePrice: number;
    coords?: [number, number];
};

export default function YandexMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [cars, setCars] = useState<Car[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/cars")
            .then((res) => res.json())
            .then((data: Car[]) => {
                const withCoords = data.map((car, i) => ({
                    ...car,
                    coords: [
                        54.1838 + (Math.random() - 0.5) * 0.05,
                        45.1749 + (Math.random() - 0.5) * 0.08,
                    ] as [number, number],
                }));
                setCars(withCoords);
            })
            .catch((err) => {
                console.error("Error loading cars:", err);
                setError("Не удалось загрузить автомобили");
            });
        
        if (!window.ymaps) {
            const script = document.createElement("script");
            script.src = "https://api-maps.yandex.ru/2.1/?apikey=8abd7840-30b9-4a76-a394-d13456777164&lang=ru_RU";
            script.async = true;
            script.onerror = () => {
                setError("Не удалось загрузить Яндекс.Карты");
                setLoaded(true);
            };
            script.onload = () => {
                console.log("Yandex Maps API loaded");
                setLoaded(true);
            };
            document.head.appendChild(script);
        } else {
            setLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!loaded || !mapRef.current || cars.length === 0) {
            console.log("Map not ready:", { loaded, hasRef: !!mapRef.current, carsCount: cars.length });
            return;
        }

        if (!window.ymaps) {
            console.error("ymaps not defined");
            setError("API Яндекс.Карт не загружен");
            return;
        }

        try {
            window.ymaps.ready(() => {
                console.log("ymaps.ready called");

                const map = new window.ymaps.Map(mapRef.current!, {
                    center: [54.1838, 45.1749],
                    zoom: 13,
                    controls: ["zoomControl"],
                });

                console.log("Map created, adding placemarks...");

                cars.forEach((car) => {
                    const isCarshare = car.type === "CARSHARE" || car.type === "BOTH";
                    const priceLabel = isCarshare
                        ? `${car.pricePerDay} ₽/день`
                        : `${car.leasePrice} ₽/мес`;

                    const placemark = new window.ymaps.Placemark(
                        car.coords!,
                        {
                            balloonContent: `
                <div style="padding: 15px; max-width: 250px;">
                  <h3 style="margin: 0 0 10px; font-size: 18px; font-weight: bold;">
                    ${car.brand} ${car.model}
                  </h3>
                  <p style="margin: 0 0 8px; color: #666;">${car.year} год</p>
                  <div style="background: #f0f2f5; padding: 10px; border-radius: 8px; text-align: center;">
                    <strong style="color: #3498db; font-size: 16px;">${priceLabel}</strong>
                  </div>
                </div>
              `,
                            hintContent: `${car.brand} ${car.model}`,
                        },
                        {
                            preset: isCarshare
                                ? "islands#blueAutoIcon"
                                : "islands#greenCarIcon",
                        }
                    );

                    map.geoObjects.add(placemark);
                    console.log(`Added placemark for ${car.brand} ${car.model}`);
                });

                console.log("All placemarks added");
            });
        } catch (err) {
            console.error("Error creating map:", err);
            setError("Ошибка при создании карты");
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.innerHTML = "";
            }
        };
    }, [loaded, cars]);

    if (error) {
        return (
            <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg bg-red-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 font-medium mb-2">{error}</p>
                    <p className="text-sm text-gray-600">Проверьте API ключ Яндекс.Карт</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={mapRef}
            className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg"
            style={{ background: "#f0f2f5" }}
        >
            {!loaded && (
                <div className="flex items-center justify-center h-full bg-gray-100">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-600 font-medium">Загрузка карты...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

//postgresql://postgres:SjygzoNZDASs7Tbj@db.zbzsnnfqneiwqgcpvvbf.supabase.co:5432/postgres