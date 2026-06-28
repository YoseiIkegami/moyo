import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/moyo/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@ikg-systems/moyo": fileURLToPath(new URL("../packages/core/src/index.ts", import.meta.url)),
      "@ikg-systems/moyo-vue": fileURLToPath(new URL("../packages/vue/src/index.ts", import.meta.url))
    }
  }
});
