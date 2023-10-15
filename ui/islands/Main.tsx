import {
  effect,
  type Signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Permission, Program } from "../../seal/main.ts";

export default function Main() {
  const currentApp: Signal<string | undefined> = useSignal(undefined);
  return (
    <div>
      <div class="flex gap-2">
        <AppList currentApp={currentApp} />
        {currentApp.value && (
          <AppSettingsView name={currentApp as Signal<string>} />
        )}
      </div>
    </div>
  );
}

function AppList({ currentApp }: { currentApp: Signal<string | undefined> }) {
  const chooseApp = (app: string) => {
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
    <div class="flex flex-col gap-1">
      {programList.value &&
        programList.value.map((name) => {
          return (
            <Button
              onClick={() => chooseApp(name)}
              class="bg-blue-800 text-white text-base font-bold p-4 m-2"
            >
              {name}
            </Button>
          );
        })}
    </div>
  );
}

function AppSettingsView({ name }: { name: Signal<string> }) {
  const app: Signal<
    {
      read: Permission;
      write: Permission;
      env: Permission;
      run: Permission;
      ffi: Permission;
      net: Permission;
    } | undefined
  > = useSignal(undefined);

  useSignalEffect(() => {
    console.log("called");
    fetch(`/api/apps`, { method: "POST", body: name.value })
      .then((res) => res.json())
      .then((data) => {
        app.value = data;
      });
  });

  const pendingChanges = useSignal(false);
  console.log(pendingChanges.value);

  return (
    <div class="flex flex-col flex-grow gap-4">
      {app.value && (
        <>
          <h2 class="text-2xl font-bold">{name.value}</h2>
          <button
            onClick={() => {
              pendingChanges.value = false;
            }}
            style={{ display: !pendingChanges.value ? "none" : "block" }}
            class="bg-green-600 text-white text-base font-bold p-4 border-2 rounded-lg"
          >
            Apply
          </button>
          <AppSetting
            name="Read"
            permission={app.value.read}
            pendingChanges={pendingChanges}
          />
          <AppSetting
            name="Write"
            permission={app.value.write}
            pendingChanges={pendingChanges}
          />
          <AppSetting
            name="Env"
            permission={app.value.env}
            pendingChanges={pendingChanges}
          />
          <AppSetting
            name="Run"
            permission={app.value.run}
            pendingChanges={pendingChanges}
          />
          <AppSetting
            name="Net"
            permission={app.value.net}
            pendingChanges={pendingChanges}
          />
          <AppSetting
            name="FFi"
            permission={app.value.ffi}
            pendingChanges={pendingChanges}
          />
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
  console.log(permission.allowed);

  return (
    <div class="flex gap-4 items-center">
      <p className="text-lg font-bold">{name}</p>
      <input
        onChange={() => {
          pendingChanges.value = true;
        }}
        type="checkbox"
        class="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        checked={permission.allowed}
      />
      <input
        onChange={() => {
          pendingChanges.value = true;
        }}
        type="text"
        class="bg-red-100  border-gray-400 border-2 rounded-lg"
        value={permission.entries ? permission.entries : ""}
      />
    </div>
  );
}
