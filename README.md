# Deno Seal

FlatSeal like permission manager for deno scripts

## Download

Binaries are built with github ci and are available at
https://github.com/denoland/deno_seal/releases

## Usage

```bash
deno --config src/ui/deno.json -A src/webview/webview.ts
```

** Compile **

```bash
deno compile --no-check --config src/ui/deno.json --include src/ui/ -A src/webview/webview.ts
```
