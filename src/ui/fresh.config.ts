import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

const port = 8487;
export default defineConfig({
  onListen: ({ port }) => {
    if (self?.postMessage) {
      self.postMessage({ port });
    } else {
      console.log(`Listening on http://localhost:${port}`);
    }
  },
  hostname: "localhost",
  port,
  plugins: [twindPlugin(twindConfig)],
});
