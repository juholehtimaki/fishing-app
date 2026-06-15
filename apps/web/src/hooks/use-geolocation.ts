import { useCallback, useEffect, useRef } from "react";
import { useGeolocationStore } from "../stores/geolocation-store";

// TODO: Remove mock - restore GEOLOCATION_OPTIONS
// const GEOLOCATION_OPTIONS: PositionOptions = {
// 	enableHighAccuracy: true,
// 	maximumAge: 10_000,
// 	timeout: 30_000,
// };

// TODO: Remove mock coordinates
const MOCK_POSITION = {
	latitude: 61.486977,
	longitude: 23.67744,
	accuracy: 10,
	speed: 4.2,
};

export const useGeolocation = () => {
	const watchIdRef = useRef<number | null>(null);
	const { tracking, setPosition, setTracking, reset } = useGeolocationStore();

	const startTracking = useCallback(() => {
		// TODO: Remove mock - use real geolocation
		setPosition({ ...MOCK_POSITION, timestamp: Date.now() });
		setTracking(true);
	}, [setTracking, setPosition]);

	const stopTracking = useCallback(() => {
		if (watchIdRef.current !== null) {
			navigator.geolocation.clearWatch(watchIdRef.current);
			watchIdRef.current = null;
		}
		reset();
	}, [reset]);

	useEffect(() => {
		if (!tracking) return;

		// TODO: Remove mock - uncomment real watchPosition
		// watchIdRef.current = navigator.geolocation.watchPosition(
		// 	(pos) => {
		// 		setPosition({
		// 			latitude: pos.coords.latitude,
		// 			longitude: pos.coords.longitude,
		// 			accuracy: pos.coords.accuracy,
		// 			speed: pos.coords.speed,
		// 			timestamp: pos.timestamp,
		// 		});
		// 	},
		// 	(err) => {
		// 		setError(err);
		// 	},
		// 	GEOLOCATION_OPTIONS,
		// );

		return () => {
			if (watchIdRef.current !== null) {
				navigator.geolocation.clearWatch(watchIdRef.current);
				watchIdRef.current = null;
			}
		};
	}, [tracking]);

	return { startTracking, stopTracking };
};
