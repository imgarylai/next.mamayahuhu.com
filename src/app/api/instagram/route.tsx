import { ImageResponse } from "next/og";
import ogs from "open-graph-scraper";
import fetchFont from "@/app/lib/fetchFont";

const SITE_NAME = "mamayahuhu.com";
const AVATAR_URL = "https://cdn.mamayahuhu.com/2023/01/avatar@2x-3.png";
const FOOTER_TEXT = "全文刊在麻麻呼呼網站";
const FONT_FAMILY = "Noto Sans TC";

const TITLE_MAX = 40;
const DESC_MAX = 80;

function truncate(text: string, max: number) {
  const chars = Array.from(text.trim());
  return chars.length > max
    ? chars.slice(0, max).join("") + "…"
    : chars.join("");
}

function parseUrl(raw: string | null): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

async function scrape(url: URL) {
  try {
    const { result } = await ogs({ url: url.toString(), timeout: 10 });
    const rawImage = result.ogImage?.[0]?.url;
    let image = AVATAR_URL;
    if (rawImage) {
      try {
        // og:image may be relative to the page.
        image = new URL(rawImage, url).toString();
      } catch {
        // keep fallback
      }
    }
    return {
      ok: true as const,
      title: result.ogTitle || "Please configure open graph title",
      desc: result.ogDescription || "Please configure open graph description",
      image,
    };
  } catch {
    return { ok: false as const };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = parseUrl(searchParams.get("url"));
  if (!url) {
    return new Response(
      "Missing or invalid `url` query parameter, e.g. /api/instagram?url=https://mamayahuhu.com/",
      { status: 400 },
    );
  }

  const meta = await scrape(url);
  if (!meta.ok) {
    return new Response(`Failed to fetch open graph data from ${url}`, {
      status: 502,
    });
  }

  const title = truncate(meta.title, TITLE_MAX);
  const desc = truncate(meta.desc, DESC_MAX);
  const glyphs = title + desc + FOOTER_TEXT + SITE_NAME + "…";

  const [regular, bold] = await Promise.all([
    fetchFont(glyphs, FONT_FAMILY, 500),
    fetchFont(glyphs, FONT_FAMILY, 900),
  ]);

  const fonts = [
    regular && { name: FONT_FAMILY, data: regular, weight: 500 as const },
    bold && { name: FONT_FAMILY, data: bold, weight: 900 as const },
  ].filter((f): f is NonNullable<typeof f> => Boolean(f));

  if (fonts.length === 0) {
    return new Response("Failed to load fonts", { status: 502 });
  }

  try {
    return new ImageResponse(
      (
        <div
          tw="flex h-full w-full flex-col border-8 border-green-500 bg-white"
          style={{ fontFamily: FONT_FAMILY }}
        >
          <div tw="flex h-3/5 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              tw="h-full w-full"
              style={{ objectFit: "cover" }}
              src={meta.image}
              alt=""
            />
          </div>
          <div tw="flex h-2/5 w-full flex-col justify-between">
            <div tw="flex flex-col px-8 pt-8">
              <div tw="flex text-5xl font-black leading-tight">{title}</div>
              <div tw="flex pt-4 text-3xl text-slate-500 leading-snug">
                {desc}
              </div>
            </div>
            <div tw="flex items-center px-6 pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img tw="h-24 w-24 rounded-full" src={AVATAR_URL} alt="" />
              <div tw="flex p-2 text-2xl text-stone-500">
                {FOOTER_TEXT}
                <span tw="ml-2 text-green-500 underline">{SITE_NAME}</span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1024,
        height: 1024,
        fonts,
        headers: {
          "Cache-Control":
            "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch {
    return new Response("Failed to generate the image", { status: 500 });
  }
}
