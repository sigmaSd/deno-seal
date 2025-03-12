# Deno Seal

FlatSeal like permission manager for deno scripts

![image](https://github.com/user-attachments/assets/1532224c-2507-41e4-8d39-38594a3123bb)

[demo.webm](https://github.com/user-attachments/assets/57468889-6e84-40f6-9a82-e653e39d12e0)

## Download

Binaries are built with github ci and are available at
https://github.com/sigmasd/deno-seal/releases

## Usage

```bash
deno --config src/ui/deno.json -A src/webview/webview.ts
```

**Compile**

```bash
deno compile --no-check --config src/ui/deno.json --include src/ui/ -A src/webview/webview.ts
```
