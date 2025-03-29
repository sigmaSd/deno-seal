import { SizeHint, Webview } from "jsr:@webview/webview@0.9.0";
import { AdwApp } from "jsr:@sigmasd/adw-app@0.1.3";

function waitForPort(worker: Worker) {
  return new Promise((resolve) => {
    worker.onmessage = (e) => {
      const { port } = e.data;
      resolve(port);
    };
  });
}

if (import.meta.main) {
  const worker = new Worker(import.meta.resolve("../ui/main.ts"), {
    type: "module",
  });
  const port = await waitForPort(worker);

  const app = new AdwApp({ id: "io.github.sigmasd.deno-seal" });
  app.run((window) => {
    const webview = new Webview(false, undefined, window);
    webview.title = "Deno Seal";
    webview.size = { width: 1200, height: 800, hint: SizeHint.NONE };
    webview.navigate(`http://localhost:${port}`);
  });
  worker.terminate();
  Deno.exit(0);
}
