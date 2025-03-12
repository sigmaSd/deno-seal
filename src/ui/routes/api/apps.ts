import type { Handlers } from "$fresh/server.ts";
import type { Message } from "../../types/mod.ts";
import {
  createProgramMap,
  type Permission,
  PermissionNameWithAll,
} from "../../../seal/main.ts";

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

        return new Response(JSON.stringify(
          {
            read: app.read(),
            write: app.write(),
            env: app.env(),
            run: app.run(),
            ffi: app.ffi(),
            net: app.net(),
            sys: app.sys(),
            all: app.all(),
          } satisfies Record<PermissionNameWithAll, Permission>,
        ));
      }
      case "updatePermission": {
        const name = message.name;
        const app = MAP[name];
        const permissionMap = message.permissionMap;
        for (
          const [permissionName, permission] of Object.entries(permissionMap)
        ) {
          app.setPermissionByName(
            //TODO: make this more typesafe
            permissionName as PermissionNameWithAll,
            permission,
          );
        }
        app.commit();
        return new Response();
      }
      case "showCode": {
        const name = message.name;
        const app = MAP[name];
        open(app.realPath());
        return new Response();
      }
    }
  },
};

function open(path: string) {
  if (path.startsWith("jsr:")) {
    path = `https://jsr.io/${path.replace(/^jsr:/, "")}`;
  }
  if (path.startsWith("npm:")) {
    path = `https://www.npmjs.com/package/${path.replace(/^npm:/, "")}`;
  }

  const openCommand = Deno.build.os === "windows"
    ? ["cmd", "/c", "start"]
    : Deno.build.os === "darwin"
    ? ["open"]
    : ["xdg-open"];

  new Deno.Command(openCommand[0], {
    args: [...openCommand.slice(1), path],
  }).spawn();
}
