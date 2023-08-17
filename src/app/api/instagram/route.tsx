import { ImageResponse } from "next/server";
import fetchFont from "@/app/lib/fetchFont";
import ogs from "open-graph-scraper";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const metadata = await ogs({ url: url! });
    const title = metadata.result.ogTitle
      ? metadata.result.ogTitle
      : "Please configure open graph title";
    const desc = metadata.result.ogDescription
      ? metadata.result.ogDescription
      : "Please configure open graph description";
    const image = metadata.result.ogImage
      ? metadata.result.ogImage[0].url
      : "https://cdn.mamayahuhu.com/2023/01/avatar@2x-3.png";
    const NotoSansMedium = await fetchFont(
      title + desc + "全文刊在麻麻呼呼網站",
      "Noto+Sans+SC",
    );

    return new ImageResponse(
      (
        <div tw="flex h-full w-full flex-col items-start justify-start border border-8 border-green-500">
          <div tw="flex h-3/5">
            <img
              tw="w-full h-full"
              style={{ objectFit: "cover" }}
              src={image}
            />
          </div>
          <div tw="flex flex-col h-2/5 w-full bg-white">
            <div tw="flex flex-col pt-8 pr-8 pl-8">
              <div tw="flex text-5xl font-black">{title}</div>
              <div tw="flex pt-4 text-3xl text-slate-500">{desc}</div>
            </div>
            <div tw="flex items-center p-2">
              <img
                tw="h-24 w-24 rounded-full"
                src="https://cdn.mamayahuhu.com/2023/01/avatar@2x-3.png"
              />
              <div tw="flex p-2 text-center text-2xl text-stone-500">
                全文刊在麻麻呼呼網站
                <span tw="ml-2 underline text-green-500">mamayahuhu.com</span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1024,
        height: 1024,
        fonts: [
          {
            name: "Noto Sans",
            data: NotoSansMedium!,
            style: "normal",
            weight: 500,
          },
        ],
      },
    );
  } catch {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
