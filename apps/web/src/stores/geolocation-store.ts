import { create } from "zustand";

export type GeolocationPosition = {
	latitude: number;
	longitude: number;
	accuracy: number;
	timestamp: number;
};

type GeolocationState = {
	position: GeolocationPosition | null;
	tracking: boolean;
	error: GeolocationPositionError | null;

	setPosition: (position: GeolocationPosition) => void;
	setTracking: (tracking: boolean) => void;
	setError: (error: GeolocationPositionError | null) => void;
	reset: () => void;
};

export const useGeolocationStore = create<GeolocationState>((set) => ({
	position: null,
	tracking: false,
	error: null,

	setPosition: (position) => set({ position, error: null }),
	setTracking: (tracking) => set({ tracking }),
	setError: (error) => set({ error }),
	reset: () => set({ position: null, tracking: false, error: null }),
}));
