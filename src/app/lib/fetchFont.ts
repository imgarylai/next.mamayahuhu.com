// Adapted from the Vercel OG playground.
// Downloads a subset of a Google Font containing only the glyphs in `text`.
export default async function fetchFont(
  text: string,
  font: string,
  weight: number,
): Promise<ArrayBuffer | null> {
  const family = `${font.replace(/ /g, "+")}:wght@${weight}`;
  const API = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(
    text,
  )}`;

  try {
    const cssRes = await fetch(API, {
      headers: {
        // Make sure Google returns TTF/OTF instead of WOFF2, which satori can't read.
        "User-Agent":
          "Mozilla/5.0 (BB10; Touch) AppleWebKit/537.1+ (KHTML, like Gecko) Version/10.0.0.1337 Mobile Safari/537.1+",
      },
    });
    if (!cssRes.ok) return null;

    const css = await cssRes.text();
    const resource = css.match(
      /src: url\((.+?)\) format\('(opentype|truetype)'\)/,
    );
    if (!resource) return null;

    const fontRes = await fetch(resource[1]);
    if (!fontRes.ok) return null;

    return fontRes.arrayBuffer();
  } catch {
    return null;
  }
}
