import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss(), basicSsl()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@workspace/ui": path.resolve(__dirname, "../../packages/ui/src"),
		},
	},
});
