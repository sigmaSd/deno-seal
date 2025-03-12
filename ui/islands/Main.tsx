import { type Signal, useSignal, useSignalEffect } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import type { Permission } from "../../seal/main.ts";
import type { Message, PermissionMap } from "../types/mod.ts";

export default function Main() {
  const currentApp: Signal<string | undefined> = useSignal(undefined);
  const showAcceptButton = useSignal(false);
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-100 border-b border-gray-700 pb-2">
            Applications
          </h2>
          <AppList
            currentApp={currentApp}
            showAcceptButton={showAcceptButton}
          />
        </div>
        <div className="md:col-span-2 bg-gray-800 rounded-xl shadow-lg p-6">
          {currentApp.value
            ? (
              <AppSettingsView
                name={currentApp as Signal<string>}
                showAcceptButton={showAcceptButton}
              />
            )
            : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-xl">
                  Select an application to manage permissions
                </p>
              </div>
            )}
        </div>
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
  const loading = useSignal(true);

  useEffect(() => {
    fetch("/api/apps")
      .then((res) => res.json())
      .then((apps) => {
        programList.value = apps;
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
  }, []);

  if (loading.value) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400">
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-2">
      {programList.value?.length === 0
        ? <p className="text-gray-400 text-center">No applications found</p>
        : (
          programList.value?.map((name) => {
            const isActive = currentApp.value === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => chooseApp(name)}
                className={`flex items-center p-3 rounded-lg transition-all text-left ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="font-medium truncate">{name}</span>
              </button>
            );
          })
        )}
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
  const loading = useSignal(true);
  const saveSuccess = useSignal(false);

  useSignalEffect(() => {
    loading.value = true;
    fetch("/api/apps", {
      method: "POST",
      body: JSON.stringify(
        { method: "getPermission", name: name.value } satisfies Message,
      ),
    })
      .then((res) => res.json())
      .then((data) => {
        app.value = data;
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
  });

  const savePermissions = () => {
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
    }).then(() => {
      showAcceptButton.value = false;
      saveSuccess.value = true;
      setTimeout(() => {
        saveSuccess.value = false;
      }, 3000);
    });
  };

  if (loading.value) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400">
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-100 flex items-center">
          <span>{name.value}</span>
          {saveSuccess.value && (
            <span className="ml-4 text-sm font-normal text-green-400 bg-green-900/50 py-1 px-3 rounded-full animate-pulse">
              Permissions saved successfully
            </span>
          )}
        </h2>

        {showAcceptButton.value && (
          <button
            type="button"
            onClick={savePermissions}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save Changes
          </button>
        )}
      </div>

      {app.value && (
        <div className="space-y-5 overflow-y-auto pr-2">
          <div className="bg-blue-900/30 rounded-lg p-4 mb-6 text-blue-300 text-sm border border-blue-800/50">
            Configure permissions for this application. Enable or disable
            specific permissions and set allowed paths or domains.
          </div>

          <AppSetting
            name="Read"
            icon="📁"
            description="Read from file system"
            permission={app.value.read}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="Write"
            icon="💾"
            description="Write to file system"
            permission={app.value.write}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="Env"
            icon="🔧"
            description="Access environment variables"
            permission={app.value.env}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="Run"
            icon="▶️"
            description="Execute subprocesses"
            permission={app.value.run}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="Net"
            icon="🌐"
            description="Network access"
            permission={app.value.net}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="FFI"
            icon="🔄"
            description="Foreign Function Interface"
            permission={app.value.ffi}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="Sys"
            icon="⚙️"
            description="System information access"
            permission={app.value.sys}
            pendingChanges={showAcceptButton}
          />
          <AppSetting
            name="All"
            icon="🔑"
            description="All permissions"
            permission={app.value.all}
            pendingChanges={showAcceptButton}
          />
        </div>
      )}
    </div>
  );
}

function AppSetting(
  { name, icon, description, permission, pendingChanges }: {
    name: string;
    icon: string;
    description: string;
    permission: Permission;
    pendingChanges: Signal<boolean>;
  },
) {
  // Create a local state to track the current permission status
  const [isAllowed, setIsAllowed] = useState(permission.allowed);

  const togglePermission = () => {
    // Update the local state first
    const newState = !isAllowed;
    setIsAllowed(newState);

    // Then update the permission object
    pendingChanges.value = true;
    permission.allowed = newState;
  };

  // Handle input changes for allowed paths
  const handlePathChange = (event: Event) => {
    // Always set pending changes to true when paths are modified
    pendingChanges.value = true;

    // Update the permission entries
    permission.entries = (event.target as HTMLInputElement).value
      ? (event.target as HTMLInputElement).value.split(",")
      : undefined;
  };

  // Make sure our local state stays in sync with the permission object
  useEffect(() => {
    setIsAllowed(permission.allowed);
  }, [permission.allowed]);

  return (
    <div
      className={`border ${
        isAllowed
          ? "border-gray-600 bg-gray-700"
          : "border-gray-700 bg-gray-750"
      } rounded-lg p-4 transition-colors`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="mr-2 text-lg">{icon}</span>
          <div>
            <h3 className="font-semibold text-gray-200">{name}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>

        <button
          onClick={togglePermission}
          className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
            isAllowed ? "bg-blue-600" : "bg-gray-500"
          }`}
          role="switch"
          aria-checked={isAllowed}
          type="button"
        >
          <span className="sr-only">Toggle permission</span>
          <span
            className={`${
              isAllowed ? "translate-x-5" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white pointer-events-none">
            {isAllowed ? "ON" : "OFF"}
          </span>
        </button>
      </div>

      {isAllowed && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Allowed paths or domains (comma separated)
          </label>
          <input
            onInput={handlePathChange}
            type="text"
            className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-200"
            placeholder={`Enter allowed ${name.toLowerCase()} paths or patterns`}
            value={permission.entries ? permission.entries.join(",") : ""}
          />
        </div>
      )}
    </div>
  );
}
