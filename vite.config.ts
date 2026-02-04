import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { viteStaticCopy } from "vite-plugin-static-copy";
export default defineConfig(({ mode }) => ({
    base: mode === "development" ? "/" : "./",
    plugins: [
        viteSingleFile(),
        viteStaticCopy({
            targets: [
                { src: "./project.json", dest: "./" },
                { src: "./preview.jpg", dest: "./" },
            ],
        }),
    ],
}));
