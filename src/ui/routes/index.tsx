import Main from "../islands/Main.tsx";

export default function Home() {
  return (
    <div>
      <header className="bg-gray-800 shadow-md border-b border-gray-700">
        <div className="container mx-auto px-6 py-4 flex items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12zM6 7h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v0a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Deno Seal</h1>
          </div>
          <div className="ml-auto text-sm text-gray-400">
            Permission Management System
          </div>
        </div>
      </header>
      <Main />
    </div>
  );
}
