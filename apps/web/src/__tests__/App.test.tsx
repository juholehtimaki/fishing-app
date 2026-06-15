import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "../App";

vi.mock("../components/map/FishingMap", () => ({
	FishingMap: () => <div data-testid="fishing-map" />,
	WMS_LAYERS: [
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
	],
}));

describe("App", () => {
	it("renders the map", () => {
		render(<App />);
		expect(screen.getByTestId("fishing-map")).toBeInTheDocument();
	});

	it("renders layer toggle controls", () => {
		render(<App />);
		expect(screen.getByText("Layers")).toBeInTheDocument();
		expect(screen.getByText("Depth Areas")).toBeInTheDocument();
		expect(screen.getByText("Depth Contours")).toBeInTheDocument();
		expect(screen.getByText("Soundings")).toBeInTheDocument();
	});

	it("renders all layer checkboxes as checked by default", () => {
		render(<App />);
		const checkboxes = screen.getAllByRole("checkbox");
		expect(checkboxes).toHaveLength(3);
		for (const checkbox of checkboxes) {
			expect(checkbox).toBeChecked();
		}
	});
});
