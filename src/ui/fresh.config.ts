import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

export default defineConfig({
  hostname: "localhost",
  port: 8487,
  plugins: [twindPlugin(twindConfig)],
});
