import { useState } from "react";
import { FishingMap, WMS_LAYERS } from "./components/map/FishingMap";
import { MapMenu } from "./components/map/MapMenu";
import { SpeedDisplay } from "./components/map/SpeedDisplay";
import { useGeolocation } from "./hooks/use-geolocation";

export const App = () => {
	const [layerVisibility, setLayerVisibility] = useState<
		Record<string, boolean>
	>(Object.fromEntries(WMS_LAYERS.map((l) => [l.id, l.visible])));

	const { startTracking, stopTracking } = useGeolocation();

	const handleToggle = (layerId: string) => {
		setLayerVisibility((prev) => ({
			...prev,
			[layerId]: !prev[layerId],
		}));
	};

	return (
		<div className="relative h-screen w-screen">
			<FishingMap layerVisibility={layerVisibility} />
			<MapMenu
				layers={WMS_LAYERS}
				layerVisibility={layerVisibility}
				onLayerToggle={handleToggle}
				onStartTracking={startTracking}
				onStopTracking={stopTracking}
			/>
			<SpeedDisplay />
		</div>
	);
};
