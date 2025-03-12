import { SizeHint, Webview } from "jsr:@webview/webview@0.9.0";

const worker = new Worker(import.meta.resolve("../ui/main.ts"), {
  type: "module",
});
const webview = new Webview();
webview.title = "Deno Seal";
webview.size = { width: 1200, height: 800, hint: SizeHint.NONE };

const port = 8487;
webview.navigate(`http://localhost:${port}`);
webview.run();
worker.terminate();
Deno.exit(0);
