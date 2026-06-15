import {
	Circle,
	Compass,
	Crosshair,
	Gauge,
	Locate,
	LocateOff,
	Menu,
	Monitor,
	Square,
	Trash2,
	X,
} from "lucide-react";
import { useState } from "react";
import { useGeolocationStore } from "../../stores/geolocation-store";
import { useMapStore } from "../../stores/map-store";
import { usePathStore } from "../../stores/path-store";
import { WMS_LAYERS } from "./wms-layers";

type MapMenuProps = {
	onStartTracking: () => void;
	onStopTracking: () => void;
};

export const MapMenu = ({ onStartTracking, onStopTracking }: MapMenuProps) => {
	const [open, setOpen] = useState(false);
	const tracking = useGeolocationStore((s) => s.tracking);
	const showSpeed = useGeolocationStore((s) => s.showSpeed);
	const setShowSpeed = useGeolocationStore((s) => s.setShowSpeed);
	const showHeading = useGeolocationStore((s) => s.showHeading);
	const setShowHeading = useGeolocationStore((s) => s.setShowHeading);
	const followLocation = useGeolocationStore((s) => s.followLocation);
	const setFollowLocation = useGeolocationStore((s) => s.setFollowLocation);
	const error = useGeolocationStore((s) => s.error);
	const keepScreenOn = useGeolocationStore((s) => s.keepScreenOn);
	const setKeepScreenOn = useGeolocationStore((s) => s.setKeepScreenOn);
	const layerVisibility = useMapStore((s) => s.layerVisibility);
	const toggleLayer = useMapStore((s) => s.toggleLayer);
	const recording = usePathStore((s) => s.recording);
	const pathPoints = usePathStore((s) => s.points);
	const startRecording = usePathStore((s) => s.startRecording);
	const stopRecording = usePathStore((s) => s.stopRecording);
	const clearPath = usePathStore((s) => s.clear);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="absolute top-4 right-4 z-20 rounded-lg bg-card p-2.5 shadow-lg ring-1 ring-foreground/10 transition-colors hover:bg-accent"
				title="Menu"
			>
				{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
			</button>

			{open && (
				<div className="absolute top-16 right-4 z-20 w-56 rounded-lg bg-card p-4 shadow-lg ring-1 ring-foreground/10">
					<div className="mb-4">
						<h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
							Location
						</h3>
						<div className="flex flex-col gap-1.5">
							<button
								type="button"
								onClick={tracking ? onStopTracking : onStartTracking}
								className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
									tracking
										? "bg-primary text-primary-foreground"
										: "hover:bg-accent"
								}`}
							>
								{tracking ? (
									<LocateOff className="h-4 w-4" />
								) : (
									<Locate className="h-4 w-4" />
								)}
								{tracking ? "Stop tracking" : "My location"}
							</button>

							<label className="flex cursor-pointer items-center gap-2 px-2.5 text-sm">
								<input
									type="checkbox"
									checked={showSpeed}
									onChange={() => setShowSpeed(!showSpeed)}
									className="accent-primary"
								/>
								<Gauge className="h-4 w-4" />
								Show speed
							</label>

							<label className="flex cursor-pointer items-center gap-2 px-2.5 text-sm">
								<input
									type="checkbox"
									checked={showHeading}
									onChange={() => setShowHeading(!showHeading)}
									className="accent-primary"
								/>
								<Compass className="h-4 w-4" />
								Show direction
							</label>

							<label className="flex cursor-pointer items-center gap-2 px-2.5 text-sm">
								<input
									type="checkbox"
									checked={followLocation}
									onChange={() => setFollowLocation(!followLocation)}
									className="accent-primary"
								/>
								<Crosshair className="h-4 w-4" />
								Follow location
							</label>

							<label className="flex cursor-pointer items-center gap-2 px-2.5 text-sm">
								<input
									type="checkbox"
									checked={keepScreenOn}
									onChange={() => setKeepScreenOn(!keepScreenOn)}
									className="accent-primary"
								/>
								<Monitor className="h-4 w-4" />
								Keep screen on
							</label>

							{error && (
								<p className="px-2.5 text-xs text-destructive">
									{error.message}
								</p>
							)}
						</div>
					</div>

					<div className="mb-4 border-t border-foreground/10 pt-3">
						<h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
							Recording
						</h3>
						<div className="flex flex-col gap-1.5">
							<button
								type="button"
								onClick={recording ? stopRecording : startRecording}
								className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
									recording
										? "bg-destructive text-destructive-foreground"
										: "hover:bg-accent"
								}`}
							>
								{recording ? (
									<Square className="h-4 w-4" />
								) : (
									<Circle className="h-4 w-4" />
								)}
								{recording ? "Stop recording" : "Record path"}
							</button>

							<button
								type="button"
								onClick={clearPath}
								disabled={pathPoints.length === 0}
								className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-40 disabled:pointer-events-none"
							>
								<Trash2 className="h-4 w-4" />
								Clear path
								{pathPoints.length > 0 ? ` (${pathPoints.length} pts)` : ""}
							</button>
						</div>
					</div>

					<div className="border-t border-foreground/10 pt-3">
						<h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
							Layers
						</h3>
						<div className="flex flex-col gap-1.5">
							{WMS_LAYERS.map((layer) => (
								<label
									key={layer.id}
									className="flex cursor-pointer items-center gap-2 text-sm"
								>
									<input
										type="checkbox"
										checked={layerVisibility[layer.id] ?? true}
										onChange={() => toggleLayer(layer.id)}
										className="accent-primary"
									/>
									{layer.label}
								</label>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
};
