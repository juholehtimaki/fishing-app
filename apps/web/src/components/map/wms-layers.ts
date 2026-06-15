export type WmsLayerConfig = {
	id: string;
	label: string;
	layer: string;
	style: string;
	visible: boolean;
};

export const WMS_LAYERS: WmsLayerConfig[] = [
	{
		id: "depth-areas",
		label: "Depth Areas",
		layer: "DepthArea_A",
		style: "syvyysalue_a",
		visible: true,
	},
	{
		id: "depth-contours",
		label: "Depth Contours",
		layer: "DepthContour_L",
		style: "syvyyskayra",
		visible: true,
	},
	{
		id: "soundings",
		label: "Soundings",
		layer: "Sounding_P",
		style: "Syvyyspiste_point",
		visible: true,
	},
];
