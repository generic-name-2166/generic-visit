import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import { defineConfig } from "vite";
import viteSolid from "vite-plugin-solid";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tsConfigPaths(),
    tanstackStart({
      prerender: {
        // prerender not supported on cloudflare https://github.com/TanStack/router/issues/5213#issuecomment-3344231116
        enabled: false,
        autoSubfolderIndex: true,
        autoStaticPathsDiscovery: true,
        crawlLinks: true,
        failOnError: true,
        onSuccess({ page }) {
          console.log(`Rendered ${page.path}!`);
        },
      },
    }),
    // solid's vite plugin must come after start's vite plugin
    viteSolid({ ssr: true }),
  ],
});
