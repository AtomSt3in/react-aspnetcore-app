import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
    plugins: [react()],

    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },

    server: isDev
        ? {
            proxy: {
                "^/weatherforecast": {
                    target: "http://localhost:5015",
                    secure: false,
                },
            },
            port: 5173,
        }
        : undefined,
});
