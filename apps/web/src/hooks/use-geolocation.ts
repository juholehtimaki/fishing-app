import { useCallback, useEffect, useRef } from "react";
import { useGeolocationStore } from "../stores/geolocation-store";

const GEOLOCATION_OPTIONS: PositionOptions = {
	enableHighAccuracy: true,
	maximumAge: 10_000,
	timeout: 30_000,
};

export const useGeolocation = () => {
	const watchIdRef = useRef<number | null>(null);
	const { tracking, setPosition, setTracking, setError, reset } =
		useGeolocationStore();

	const startTracking = useCallback(() => {
		if (!navigator.geolocation) {
			setError({
				code: 2,
				message: "Geolocation is not supported by this browser",
				PERMISSION_DENIED: 1,
				POSITION_UNAVAILABLE: 2,
				TIMEOUT: 3,
			});
			return;
		}

		setTracking(true);
	}, [setTracking, setError]);

	const stopTracking = useCallback(() => {
		if (watchIdRef.current !== null) {
			navigator.geolocation.clearWatch(watchIdRef.current);
			watchIdRef.current = null;
		}
		reset();
	}, [reset]);

	useEffect(() => {
		if (!tracking) return;

		watchIdRef.current = navigator.geolocation.watchPosition(
			(pos) => {
				setPosition({
					latitude: pos.coords.latitude,
					longitude: pos.coords.longitude,
					accuracy: pos.coords.accuracy,
					timestamp: pos.timestamp,
				});
			},
			(err) => {
				setError(err);
			},
			GEOLOCATION_OPTIONS,
		);

		return () => {
			if (watchIdRef.current !== null) {
				navigator.geolocation.clearWatch(watchIdRef.current);
				watchIdRef.current = null;
			}
		};
	}, [tracking, setPosition, setError]);

	return { startTracking, stopTracking };
};
