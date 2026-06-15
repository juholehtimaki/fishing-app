import { useEffect, useRef } from "react";
import { useGeolocationStore } from "../stores/geolocation-store";

export const useWakeLock = () => {
	const wakeLockRef = useRef<WakeLockSentinel | null>(null);
	const keepScreenOn = useGeolocationStore((s) => s.keepScreenOn);

	useEffect(() => {
		if (!keepScreenOn) {
			wakeLockRef.current?.release();
			wakeLockRef.current = null;
			return;
		}

		const acquire = async () => {
			try {
				wakeLockRef.current = await navigator.wakeLock.request("screen");
			} catch {
				// Wake lock request failed (e.g. low battery, unsupported)
			}
		};

		const onVisibilityChange = () => {
			if (document.visibilityState === "visible" && keepScreenOn) {
				acquire();
			}
		};

		acquire();
		document.addEventListener("visibilitychange", onVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", onVisibilityChange);
			wakeLockRef.current?.release();
			wakeLockRef.current = null;
		};
	}, [keepScreenOn]);
};
