import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@blob-studio/js": fileURLToPath(new URL("../packages/js/src/index.ts", import.meta.url)),
      "@blob-studio/vue": fileURLToPath(new URL("../packages/vue/src/index.ts", import.meta.url))
    }
  }
});
