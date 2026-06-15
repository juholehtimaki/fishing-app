import { useState } from "react";
import { FishingMap, WMS_LAYERS } from "./components/map/FishingMap";
import { LayerToggle } from "./components/map/LayerToggle";

export const App = () => {
	const [layerVisibility, setLayerVisibility] = useState<
		Record<string, boolean>
	>(Object.fromEntries(WMS_LAYERS.map((l) => [l.id, l.visible])));

	const handleToggle = (layerId: string) => {
		setLayerVisibility((prev) => ({
			...prev,
			[layerId]: !prev[layerId],
		}));
	};

	return (
		<div className="relative h-screen w-screen">
			<FishingMap layerVisibility={layerVisibility} />
			<LayerToggle
				layers={WMS_LAYERS}
				visibility={layerVisibility}
				onToggle={handleToggle}
			/>
		</div>
	);
};
