import { Locate, LocateOff } from "lucide-react";
import { useGeolocationStore } from "../../stores/geolocation-store";

type LocationButtonProps = {
	onStart: () => void;
	onStop: () => void;
};

export const LocationButton = ({ onStart, onStop }: LocationButtonProps) => {
	const tracking = useGeolocationStore((s) => s.tracking);
	const error = useGeolocationStore((s) => s.error);

	return (
		<div className="absolute bottom-6 right-4 z-10">
			<button
				type="button"
				onClick={tracking ? onStop : onStart}
				className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium shadow-lg ring-1 transition-colors ${
					tracking
						? "bg-primary text-primary-foreground ring-primary/50"
						: "bg-card text-card-foreground ring-foreground/10 hover:bg-accent"
				}`}
				title={tracking ? "Stop tracking location" : "Start tracking location"}
			>
				{tracking ? (
					<LocateOff className="h-4 w-4" />
				) : (
					<Locate className="h-4 w-4" />
				)}
				{tracking ? "Stop tracking" : "My location"}
			</button>
			{error && (
				<p className="mt-1 max-w-48 text-xs text-destructive">
					{error.message}
				</p>
			)}
		</div>
	);
};
