import type { Handlers } from "$fresh/server.ts";
import type { Message } from "../../types/mod.ts";
import { createProgramMap } from "../../../seal/main.ts";

const MAP = await createProgramMap();

export const handler: Handlers = {
  GET(_req) {
    return new Response(JSON.stringify(Object.keys(MAP)));
  },
  async POST(req) {
    const message: Message = await req.json();
    switch (message.method) {
      case "getPermission": {
        const name = message.name;
        const app = MAP[name];
        if (!app) throw "app not found (FIXME)";
        return new Response(JSON.stringify({
          read: app.read(),
          write: app.write(),
          env: app.env(),
          run: app.run(),
          ffi: app.ffi(),
          net: app.net(),
          all: app.all(),
        }));
      }
      case "updatePermission": {
        const name = message.name;
        const app = MAP[name];
        const permissionMap = message.permissionMap;
        for (
          const [permissionName, permission] of Object.entries(permissionMap)
        ) {
          app.setPermissionByName(permissionName, permission);
        }
        app.commit();
        return new Response();
      }
    }
  },
};
