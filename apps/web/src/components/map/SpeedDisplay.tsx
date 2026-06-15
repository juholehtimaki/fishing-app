import { useGeolocationStore } from "../../stores/geolocation-store";

const MS_TO_KMH = 3.6;

export const SpeedDisplay = () => {
	const position = useGeolocationStore((s) => s.position);
	const showSpeed = useGeolocationStore((s) => s.showSpeed);
	const tracking = useGeolocationStore((s) => s.tracking);

	if (!tracking || !showSpeed) return null;

	const speedKmh = position?.speed != null ? position.speed * MS_TO_KMH : null;

	return (
		<div
			className="absolute left-4 z-10 rounded-lg bg-card px-4 py-3 shadow-lg ring-1 ring-foreground/10"
			style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
		>
			<p className="text-xs text-muted-foreground">Speed</p>
			<p className="text-2xl font-semibold tabular-nums">
				{speedKmh != null ? speedKmh.toFixed(1) : "--"}
				<span className="ml-1 text-sm font-normal text-muted-foreground">
					km/h
				</span>
			</p>
		</div>
	);
};
