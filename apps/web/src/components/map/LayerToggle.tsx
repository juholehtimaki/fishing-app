import type { WmsLayerConfig } from "./FishingMap";

type LayerToggleProps = {
	layers: WmsLayerConfig[];
	visibility: Record<string, boolean>;
	onToggle: (layerId: string) => void;
};

export const LayerToggle = ({
	layers,
	visibility,
	onToggle,
}: LayerToggleProps) => (
	<div className="absolute top-4 right-4 z-10 rounded-lg bg-card p-3 shadow-lg ring-1 ring-foreground/10">
		<h3 className="mb-2 text-sm font-medium">Layers</h3>
		<div className="flex flex-col gap-1.5">
			{layers.map((layer) => (
				<label
					key={layer.id}
					className="flex cursor-pointer items-center gap-2 text-sm"
				>
					<input
						type="checkbox"
						checked={visibility[layer.id] ?? true}
						onChange={() => onToggle(layer.id)}
						className="accent-primary"
					/>
					{layer.label}
				</label>
			))}
		</div>
	</div>
);
