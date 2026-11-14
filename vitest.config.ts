import { defineConfig, mergeConfig } from "vite-plus";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "node",
      include: ["tests/**/*.test.ts"],
      restoreMocks: true,
    },
  }),
);
