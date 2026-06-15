import { Toaster } from "@workspace/ui/components/sonner";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<ErrorBoundary>
			<App />
			<Toaster richColors />
		</ErrorBoundary>
	</StrictMode>,
);
