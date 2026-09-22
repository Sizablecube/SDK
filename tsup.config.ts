import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  // React/React Query/axios come from whatever app installs this package —
  // bundling them in would risk two copies of React Query (and its cache)
  // existing at once.
  external: ["react", "@tanstack/react-query", "axios"],
});
