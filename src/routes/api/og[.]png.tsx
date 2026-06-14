import { createFileRoute } from "@tanstack/react-router";
import { ImageResponse } from "@takumi-rs/image-response";
import { SITE_NAME } from "@/lib/seo";

/**
 * Dynamic Open Graph image endpoint: `/api/og.png?title=...&description=...`
 *
 * Rendered with Takumi. On Cloudflare Workers, `ImageResponse` auto-detects the
 * `workerd` runtime and loads its WASM build (`@takumi-rs/wasm/auto`) — no manual
 * init is required. The WASM build ships no default fonts and does not decompress
 * WOFF2, so we supply an uncompressed variable TTF, served as a static asset from
 * `public/fonts/` and fetched same-origin (cached per worker isolate).
 */
const FONT_PATH = "/fonts/InterVariable.ttf";

let fontPromise: Promise<ArrayBuffer> | null = null;

function loadFont(request: Request): Promise<ArrayBuffer> {
  fontPromise ??= fetch(new URL(FONT_PATH, request.url)).then((res) => {
    if (!res.ok) throw new Error(`Failed to load OG font: ${res.status}`);
    return res.arrayBuffer();
  });
  return fontPromise;
}

export const Route = createFileRoute("/api/og.png")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const title = params.get("title") ?? SITE_NAME;
        const description = params.get("description") ?? "";

        const fontData = await loadFont(request);

        return new ImageResponse(
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
          {
            width: 1200,
            height: 630,
            format: "png",
            fonts: [{ name: "Inter", data: new Uint8Array(fontData) }],
            headers: {
              "Cache-Control": "public, max-age=31536000, immutable",
              "CDN-Cache-Control": "public, max-age=31536000, immutable",
            },
          },
        );
      },
    },
  },
});
