import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

const port = 8487;
export default defineConfig({
  onListen: () => {
    if (self) {
      self.postMessage({ port });
    }
  },
  hostname: "localhost",
  port,
  plugins: [twindPlugin(twindConfig)],
});
