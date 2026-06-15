import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WMS_LAYERS } from "../components/map/wms-layers";

type MapState = {
	layerVisibility: Record<string, boolean>;
	toggleLayer: (layerId: string) => void;
};

export const useMapStore = create<MapState>()(
	persist(
		(set) => ({
			layerVisibility: Object.fromEntries(
				WMS_LAYERS.map((l) => [l.id, l.visible]),
			),
			toggleLayer: (layerId) =>
				set((state) => ({
					layerVisibility: {
						...state.layerVisibility,
						[layerId]: !state.layerVisibility[layerId],
					},
				})),
		}),
		{
			name: "map-preferences",
		},
	),
);
