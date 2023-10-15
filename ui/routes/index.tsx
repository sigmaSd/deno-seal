import { useSignal } from "@preact/signals";
import Main from "../islands/Main.tsx";

export default function Home() {
  return (
    <div>
      <h1 class="text-4xl font-bold">Deno Seal</h1>
      <Main />
    </div>
  );
}
