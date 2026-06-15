import "ol/ol.css";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OlMap from "ol/Map";
import Overlay from "ol/Overlay";
import { get as getProjection, transform } from "ol/proj";
import { register } from "ol/proj/proj4";
import OSM from "ol/source/OSM";
import TileWMS from "ol/source/TileWMS";
import VectorSource from "ol/source/Vector";
import { Stroke, Style } from "ol/style";
import View from "ol/View";
import proj4 from "proj4";
import { useEffect, useRef } from "react";
import { useGeolocationStore } from "../../stores/geolocation-store";
import { useMapStore } from "../../stores/map-store";
import { usePathStore } from "../../stores/path-store";

// Register EPSG:3067 (ETRS-TM35FIN) projection
proj4.defs(
	"EPSG:3067",
	"+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs",
);
register(proj4);

const projection = getProjection("EPSG:3067");
if (projection) {
	projection.setExtent([-548576, 6291456, 1548576, 8388608]);
}

const resolutions = [
	8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25,
];

import { WMS_LAYERS } from "./wms-layers";

const TRAFICOM_WMS_URL =
	"https://julkinen.traficom.fi/inspirepalvelu/rajoitettu/wms";

// Prediction line: show where the boat will be in 180 seconds
const PREDICTION_SECONDS = 180;
const MIN_PREDICTION_DISTANCE = 350; // meters, so the line is visible even at low speed

const headingLineStyle = new Style({
	stroke: new Stroke({
		color: "rgba(37, 99, 235, 0.6)",
		width: 4,
		lineDash: [10, 8],
	}),
});

const pathLineStyle = new Style({
	stroke: new Stroke({
		color: "rgba(220, 38, 38, 0.8)",
		width: 3,
	}),
});

function createLocationMarkerElement(): HTMLDivElement {
	const container = document.createElement("div");
	container.className = "location-marker";

	const pulse = document.createElement("div");
	pulse.className = "location-marker-pulse";

	const dot = document.createElement("div");
	dot.className = "location-marker-dot";

	container.appendChild(pulse);
	container.appendChild(dot);
	return container;
}

/**
 * Calculate the endpoint of the heading prediction line.
 * Heading is in degrees (0 = north, clockwise).
 * In EPSG:3067 (UTM): x = easting, y = northing.
 */
function calculateHeadingEndpoint(
	origin: number[],
	headingDeg: number,
	distance: number,
): number[] {
	const headingRad = (headingDeg * Math.PI) / 180;
	return [
		origin[0] + distance * Math.sin(headingRad),
		origin[1] + distance * Math.cos(headingRad),
	];
}

export const FishingMap = () => {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<OlMap | null>(null);
	const wmsLayersRef = useRef<Record<string, TileLayer>>({});
	const locationOverlayRef = useRef<Overlay | null>(null);
	const headingFeatureRef = useRef<Feature<LineString>>(new Feature());
	const pathFeatureRef = useRef<Feature<LineString>>(new Feature());

	const layerVisibility = useMapStore((s) => s.layerVisibility);
	const position = useGeolocationStore((s) => s.position);
	const showHeading = useGeolocationStore((s) => s.showHeading);
	const followLocation = useGeolocationStore((s) => s.followLocation);
	const pathPoints = usePathStore((s) => s.points);

	useEffect(() => {
		if (!mapRef.current || mapInstanceRef.current) return;

		const baseLayer = new TileLayer({
			source: new OSM(),
		});

		const wmsLayers = WMS_LAYERS.map((config) => {
			const layer = new TileLayer({
				source: new TileWMS({
					url: TRAFICOM_WMS_URL,
					params: {
						LAYERS: config.layer,
						STYLES: config.style,
						FORMAT: "image/png",
						TRANSPARENT: true,
						VERSION: "1.3.0",
					},
					projection: "EPSG:3067",
				}),
				visible: config.visible,
			});
			wmsLayersRef.current[config.id] = layer;
			return layer;
		});

		const headingLayer = new VectorLayer({
			source: new VectorSource({
				features: [headingFeatureRef.current],
			}),
			style: headingLineStyle,
		});

		const pathLayer = new VectorLayer({
			source: new VectorSource({
				features: [pathFeatureRef.current],
			}),
			style: pathLineStyle,
		});

		const locationOverlay = new Overlay({
			element: createLocationMarkerElement(),
			positioning: "center-center",
			stopEvent: false,
		});
		locationOverlayRef.current = locationOverlay;

		const map = new OlMap({
			target: mapRef.current,
			layers: [baseLayer, ...wmsLayers, pathLayer, headingLayer],
			overlays: [locationOverlay],
			controls: [],
			view: new View({
				projection: "EPSG:3067",
				center: [324000, 6822000],
				zoom: 12,
				resolutions,
			}),
		});

		mapInstanceRef.current = map;

		return () => {
			map.setTarget(undefined);
			mapInstanceRef.current = null;
		};
	}, []);

	useEffect(() => {
		for (const [id, layer] of Object.entries(wmsLayersRef.current)) {
			layer.setVisible(layerVisibility[id] ?? true);
		}
	}, [layerVisibility]);

	useEffect(() => {
		if (pathPoints.length < 2) {
			pathFeatureRef.current.setGeometry(undefined);
			return;
		}
		const coords = pathPoints.map((p) =>
			transform([p.longitude, p.latitude], "EPSG:4326", "EPSG:3067"),
		);
		pathFeatureRef.current.setGeometry(new LineString(coords));
	}, [pathPoints]);

	useEffect(() => {
		const overlay = locationOverlayRef.current;
		if (!overlay) return;

		if (!position) {
			overlay.setPosition(undefined);
			headingFeatureRef.current.setGeometry(undefined);
			return;
		}

		const coords = transform(
			[position.longitude, position.latitude],
			"EPSG:4326",
			"EPSG:3067",
		);
		overlay.setPosition(coords);

		if (followLocation) {
			mapInstanceRef.current?.getView().animate({
				center: coords,
				duration: 300,
			});
		}

		if (showHeading && position.heading != null) {
			const speed = position.speed ?? 0;
			const distance = Math.max(
				speed * PREDICTION_SECONDS,
				MIN_PREDICTION_DISTANCE,
			);
			const endpoint = calculateHeadingEndpoint(
				coords,
				position.heading,
				distance,
			);
			headingFeatureRef.current.setGeometry(new LineString([coords, endpoint]));
		} else {
			headingFeatureRef.current.setGeometry(undefined);
		}
	}, [position, showHeading, followLocation]);

	return <div ref={mapRef} className="h-full w-full" />;
};
