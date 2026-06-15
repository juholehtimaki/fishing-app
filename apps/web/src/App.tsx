import { FishingMap } from "./components/map/FishingMap";
import { MapMenu } from "./components/map/MapMenu";
import { SpeedDisplay } from "./components/map/SpeedDisplay";
import { useGeolocation } from "./hooks/use-geolocation";
import { useWakeLock } from "./hooks/use-wake-lock";

export const App = () => {
	const { startTracking, stopTracking } = useGeolocation();
	useWakeLock();

	return (
		<div className="relative h-screen w-screen">
			<FishingMap />
			<MapMenu onStartTracking={startTracking} onStopTracking={stopTracking} />
			<SpeedDisplay />
		</div>
	);
};
