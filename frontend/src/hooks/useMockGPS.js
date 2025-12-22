import { useEffect, useState } from "react";

export const useMockGPS = (enabled) => {
    const route = [
        { lat: 28.6139, lng: 77.2090 },

        { lat: 28.6200, lng: 77.2300 },
        { lat: 28.6304, lng: 77.2506 },

        { lat: 28.7041, lng: 77.1025 },
        { lat: 28.6765, lng: 77.2218 },

        { lat: 28.5355, lng: 77.3910 }, { lat: 28.5672, lng: 77.3450 },

        { lat: 28.6692, lng: 77.4538 }, { lat: 28.6087, lng: 77.2958 },

        { lat: 28.4089, lng: 77.3178 }, { lat: 28.4026, lng: 77.3077 },

        { lat: 28.4595, lng: 77.0266 }, { lat: 28.4800, lng: 76.9950 },

        { lat: 28.3540, lng: 76.9426 }, { lat: 28.2000, lng: 76.6000 },

        { lat: 28.1990, lng: 76.6195 },
    ];
    const [index, setIndex] = useState(0);
    const [location, setLocation] = useState(route[0]);

    useEffect(() => {
        if (!enabled) return;

        const interval = setInterval(() => {
            setIndex(i => {
                if (i >= route.length - 1) return i;
                setLocation(route[i + 1]);
                return i + 1;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [enabled]);

    return location;
};
