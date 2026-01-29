import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const removeModuleAndCrossorigin = () => {
    return {
        name: "remove-module-and-crossorigin",
        transformIndexHtml(html: string) {
            return html
                .replaceAll('type="module" ', "defer ")
                .replaceAll("crossorigin ", "");
        },
    };
};
export default defineConfig(({ mode }) => ({
    base: mode === "development" ? "/" : "./",
    plugins: [viteSingleFile()],
}));
