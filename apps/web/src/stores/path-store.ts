import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PathPoint = {
	latitude: number;
	longitude: number;
	timestamp: number;
};

type PathState = {
	recording: boolean;
	points: PathPoint[];

	startRecording: () => void;
	stopRecording: () => void;
	addPoint: (point: PathPoint) => void;
	clear: () => void;
};

/** Minimum distance in meters between recorded points to avoid redundant storage. */
const MIN_RECORD_DISTANCE = 5;

/**
 * Haversine distance between two lat/lng points in meters.
 */
function haversineDistance(
	lat1: number,
	lng1: number,
	lat2: number,
	lng2: number,
): number {
	const R = 6371000;
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const dLat = toRad(lat2 - lat1);
	const dLng = toRad(lng2 - lng1);
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const usePathStore = create<PathState>()(
	persist(
		(set, get) => ({
			recording: false,
			points: [],

			startRecording: () => set({ recording: true }),
			stopRecording: () => set({ recording: false }),
			addPoint: (point) => {
				const { points } = get();
				if (points.length > 0) {
					const last = points[points.length - 1];
					const dist = haversineDistance(
						last.latitude,
						last.longitude,
						point.latitude,
						point.longitude,
					);
					if (dist < MIN_RECORD_DISTANCE) return;
				}
				set({ points: [...points, point] });
			},
			clear: () => set({ points: [], recording: false }),
		}),
		{
			name: "path-recording",
		},
	),
);
