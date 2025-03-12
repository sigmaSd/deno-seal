import { type Signal, useSignal, useSignalEffect } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Permission } from "../../seal/main.ts";
import type { Message, PermissionMap } from "../types/mod.ts";

export default function Main() {
  const currentApp: Signal<string | undefined> = useSignal(undefined);
  const showAcceptButton = useSignal(false);
  return (
    <div>
      <div class="flex flex-col gap-2">
        <AppList
          currentApp={currentApp}
          showAcceptButton={showAcceptButton}
        />
        {currentApp.value && (
          <AppSettingsView
            name={currentApp as Signal<string>}
            showAcceptButton={showAcceptButton}
          />
        )}
      </div>
    </div>
  );
}

function AppList(
  { currentApp, showAcceptButton }: {
    currentApp: Signal<string | undefined>;
    showAcceptButton: Signal<boolean>;
  },
) {
  const chooseApp = (app: string) => {
    showAcceptButton.value = false;
    currentApp.value = app;
  };
  const programList: Signal<string[]> = useSignal([]);
  useEffect(() => {
    fetch("/api/apps")
      .then((res) => res.json())
      .then((apps) => {
        programList.value = apps;
      });
  }, []);
  return (
    <div class="flex flex-row flex-wrap gap-1">
      {programList.value?.map((name) => {
        return (
          <button
            type="button"
            onClick={() => chooseApp(name)}
            class="bg-blue-800 text-white text-base font-bold p-4 m-2"
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}

function AppSettingsView(
  { name, showAcceptButton }: {
    name: Signal<string>;
    showAcceptButton: Signal<boolean>;
  },
) {
  const app: Signal<PermissionMap | undefined> = useSignal(undefined);

  useSignalEffect(() => {
    fetch("/api/apps", {
      method: "POST",
      body: JSON.stringify(
        { method: "getPermission", name: name.value } satisfies Message,
      ),
    })
      .then((res) => res.json())
      .then((data) => {
        app.value = data;
      });
  });

  return (
    <div class="flex flex-col flex-grow gap-4 ml-2">
      {app.value && (
        <>
          <h2 class="text-2xl font-bold">{name.value}</h2>
          <AppSetting
            name="Read"
            permission={app.value.read}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="Write"
            permission={app.value.write}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="Env"
            permission={app.value.env}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="Run"
            permission={app.value.run}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="Net"
            permission={app.value.net}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="FFi"
            permission={app.value.ffi}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="Sys"
            permission={app.value.sys}
            pendingChanges={showAcceptButton}
          />

          <AppSetting
            name="All"
            permission={app.value.all}
            pendingChanges={showAcceptButton}
          />
          <button
            type="button"
            onClick={() => {
              showAcceptButton.value = false;
              if (!app.value) return;
              fetch("/api/apps", {
                method: "POST",
                body: JSON.stringify(
                  {
                    method: "updatePermission",
                    name: name.value,
                    permissionMap: app.value,
                  } satisfies Message,
                ),
              });
            }}
            style={{ display: !showAcceptButton.value ? "none" : "block" }}
            class="bg-green-600 text-white text-base font-bold p-4 border-2 rounded-lg"
          >
            Apply
          </button>
        </>
      )}
    </div>
  );
}

function AppSetting(
  { name, permission, pendingChanges }: {
    name: string;
    permission: Permission;
    pendingChanges: Signal<boolean>;
  },
) {
  return (
    <div class="flex gap-4 items-center">
      <p className="text-lg font-bold">{name}</p>
      <input
        onChange={() => {
          pendingChanges.value = true;
          permission.allowed = !permission.allowed;
        }}
        type="checkbox"
        class="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        checked={permission.allowed}
      />
      <input
        onChange={(event) => {
          pendingChanges.value = true;
          //@ts-ignore value exists
          permission.entries = event.target?.value
            //@ts-ignore value exists
            ? event.target.value.split(",")
            : undefined;
        }}
        type="text"
        class="bg-red-100  border-gray-400 border-2 rounded-lg"
        value={permission.entries ? permission.entries.join(",") : ""}
      />
    </div>
  );
}
