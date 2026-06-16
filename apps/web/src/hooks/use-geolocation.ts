import { useCallback, useEffect, useRef } from "react";
import { useGeolocationStore } from "../stores/geolocation-store";
import { usePathStore } from "../stores/path-store";

const GEOLOCATION_OPTIONS: PositionOptions = {
	enableHighAccuracy: true,
	maximumAge: 10_000,
	timeout: 30_000,
};

/** If no position update arrives within this window, restart the watch. */
const STALE_THRESHOLD_MS = 15_000;
const WATCHDOG_INTERVAL_MS = 5_000;

export const useGeolocation = () => {
	const watchIdRef = useRef<number | null>(null);
	const lastUpdateRef = useRef<number>(0);
	const { tracking, setPosition, setTracking, setError, reset } =
		useGeolocationStore();

	const clearWatch = useCallback(() => {
		if (watchIdRef.current !== null) {
			navigator.geolocation.clearWatch(watchIdRef.current);
			watchIdRef.current = null;
		}
	}, []);

	const startWatch = useCallback(() => {
		clearWatch();
		lastUpdateRef.current = Date.now();

		watchIdRef.current = navigator.geolocation.watchPosition(
			(pos) => {
				lastUpdateRef.current = Date.now();
				setPosition({
					latitude: pos.coords.latitude,
					longitude: pos.coords.longitude,
					accuracy: pos.coords.accuracy,
					speed: pos.coords.speed,
					heading: pos.coords.heading,
					timestamp: pos.timestamp,
				});

				const { recording, addPoint } = usePathStore.getState();
				if (recording) {
					addPoint({
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
						timestamp: pos.timestamp,
					});
				}
			},
			(err) => {
				setError(err);
			},
			GEOLOCATION_OPTIONS,
		);
	}, [clearWatch, setPosition, setError]);

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
		clearWatch();
		reset();
	}, [clearWatch, reset]);

	useEffect(() => {
		if (!tracking) return;

		startWatch();

		// Watchdog: restart the watch if updates stop arriving
		const watchdogId = setInterval(() => {
			if (Date.now() - lastUpdateRef.current > STALE_THRESHOLD_MS) {
				startWatch();
			}
		}, WATCHDOG_INTERVAL_MS);

		return () => {
			clearWatch();
			clearInterval(watchdogId);
		};
	}, [tracking, startWatch, clearWatch]);

	return { startTracking, stopTracking };
};
