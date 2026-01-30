import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
export default defineConfig(({ mode }) => ({
    base: mode === "development" ? "/" : "./",
    plugins: [viteSingleFile()],
}));
