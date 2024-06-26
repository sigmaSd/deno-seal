import type { Permission } from "../../seal/main.ts";

export interface PermissionMap {
  read: Permission;
  write: Permission;
  env: Permission;
  run: Permission;
  ffi: Permission;
  net: Permission;
  all: Permission;
}

export type Message =
  | {
    method: "getPermission";
    name: string;
  }
  | {
    method: "updatePermission";
    name: string;
    permissionMap: PermissionMap;
  };
