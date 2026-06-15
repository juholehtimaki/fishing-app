import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GeolocationPosition = {
	latitude: number;
	longitude: number;
	accuracy: number;
	speed: number | null;
	heading: number | null;
	timestamp: number;
};

type GeolocationState = {
	position: GeolocationPosition | null;
	tracking: boolean;
	showSpeed: boolean;
	showHeading: boolean;
	followLocation: boolean;
	error: GeolocationPositionError | null;

	setPosition: (position: GeolocationPosition) => void;
	setTracking: (tracking: boolean) => void;
	setShowSpeed: (showSpeed: boolean) => void;
	setShowHeading: (showHeading: boolean) => void;
	setFollowLocation: (followLocation: boolean) => void;
	setError: (error: GeolocationPositionError | null) => void;
	reset: () => void;
};

export const useGeolocationStore = create<GeolocationState>()(
	persist(
		(set) => ({
			position: null,
			tracking: false,
			showSpeed: false,
			showHeading: false,
			followLocation: false,
			error: null,

			setPosition: (position) => set({ position, error: null }),
			setTracking: (tracking) => set({ tracking }),
			setShowSpeed: (showSpeed) => set({ showSpeed }),
			setShowHeading: (showHeading) => set({ showHeading }),
			setFollowLocation: (followLocation) => set({ followLocation }),
			setError: (error) => set({ error }),
			reset: () => set({ position: null, tracking: false, error: null }),
		}),
		{
			name: "geolocation-preferences",
			partialize: (state) => ({
				tracking: state.tracking,
				showSpeed: state.showSpeed,
				showHeading: state.showHeading,
				followLocation: state.followLocation,
			}),
		},
	),
);
