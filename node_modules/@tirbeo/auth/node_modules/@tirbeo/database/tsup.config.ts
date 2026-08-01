import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    client: "src/client.ts",
    types: "src/types.ts",
    "server-client": "src/server-client.ts",
    "middleware-client": "src/middleware-client.ts",
    "settings-schemas": "src/settings-schemas.ts",
    "settings-service": "src/settings-service.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ["@supabase/supabase-js", "@supabase/ssr", "next"],
});
