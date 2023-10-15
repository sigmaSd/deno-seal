import { Handlers } from "$fresh/server.ts";
import { createProgramMap } from "../../../seal/main.ts";

const MAP = createProgramMap();

export const handler: Handlers = {
  GET(_req) {
    return new Response(JSON.stringify(Object.keys(MAP)));
  },
  async POST(req) {
    const name = await req.text();
    const app = MAP[name];
    if (!app) throw "app not found (FIXME)";
    return new Response(JSON.stringify({
      read: app.read(),
      write: app.write(),
      env: app.env(),
      run: app.run(),
      ffi: app.ffi(),
      net: app.net(),
    }));
  },
};
