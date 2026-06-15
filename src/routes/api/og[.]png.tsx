import { createFileRoute } from "@tanstack/react-router";
import { fromJsx } from "@takumi-rs/helpers/jsx";
import { Renderer, initSync } from "@takumi-rs/wasm";
// The Cloudflare Vite plugin resolves this `.wasm` import to a `WebAssembly.Module`
// (default export) at build time; the package's bundled types only describe the raw
// wasm-bindgen bindings (named exports, no default), so we ignore that here.
// @ts-expect-error -- .wasm default export is provided by the Cloudflare Vite plugin
import wasm from "@takumi-rs/wasm/takumi_wasm_bg.wasm";
import { SITE_NAME } from "@/lib/seo";

/**
 * Dynamic Open Graph image endpoint: `/api/og.png?title=...&description=...`
 *
 * Rendered with Takumi's WASM build, driven directly via `@takumi-rs/wasm`.
 *
 * We intentionally do NOT use `@takumi-rs/image-response` here: its `render()`
 * resolves the WASM through a `/* @vite-ignore *\/ import("@takumi-rs/wasm")`
 * that Vite leaves unbundled, which works in `vite dev` but throws
 * `No such module "@takumi-rs/wasm"` on the built Cloudflare Worker. Static
 * imports of the renderer + `.wasm` module get bundled by the Cloudflare Vite
 * plugin (the `.wasm` as a `WebAssembly.Module`), so this runs on workerd.
 *
 * The WASM build ships no default fonts and does not decompress WOFF2, so we
 * supply an uncompressed variable TTF, served as a static asset from
 * `public/fonts/` and fetched same-origin (renderer cached per worker isolate).
 */
const FONT_PATH = "/fonts/InterVariable.ttf";

let rendererPromise: Promise<Renderer> | null = null;

function getRenderer(request: Request): Promise<Renderer> {
  rendererPromise ??= (async () => {
    initSync({ module: wasm });
    const res = await fetch(new URL(FONT_PATH, request.url));
    if (!res.ok) throw new Error(`Failed to load OG font: ${res.status}`);
    const data = new Uint8Array(await res.arrayBuffer());
    return new Renderer({ fonts: [{ name: "Inter", data }] });
  })();
  return rendererPromise;
}

export const Route = createFileRoute("/api/og.png")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const title = params.get("title") ?? SITE_NAME;
        const description = params.get("description") ?? "";

        const renderer = await getRenderer(request);
        const { node, stylesheets } = await fromJsx(
          <div tw="flex h-full w-full flex-col bg-neutral-900 p-20 text-neutral-50">
            <div tw="flex flex-1 flex-col justify-center">
              <div
                tw="text-8xl tracking-tight"
                style={{ fontWeight: 700, fontVariationSettings: "'wght' 700" }}
              >
                {title}
              </div>
              {description ? (
                <div tw="mt-8 text-3xl leading-snug text-neutral-400" style={{ fontWeight: 400 }}>
                  {description}
                </div>
              ) : null}
            </div>
            <div tw="text-2xl text-neutral-500" style={{ fontWeight: 500 }}>
              {SITE_NAME}
            </div>
          </div>,
        );

        const png = renderer.render(node, {
          width: 1200,
          height: 630,
          format: "png",
          stylesheets,
        });

        return new Response(png.buffer as ArrayBuffer, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
            "CDN-Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
