type Props = {
  searchParams: Promise<{ url?: string | string[] }>;
};

export default async function Home({ searchParams }: Props) {
  const { url: rawUrl } = await searchParams;
  const url = (Array.isArray(rawUrl) ? rawUrl[0] : rawUrl)?.trim() ?? "";
  const imageSrc = url ? `/api/instagram?url=${encodeURIComponent(url)}` : "";

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-4 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-green-700 dark:text-green-400">
          麻麻呼呼 IG 分享圖產生器
        </h1>
        <p className="text-stone-600 dark:text-stone-400">
          貼上文章網址，自動讀取 Open Graph 標題、描述與封面，產生 1024×1024 的
          Instagram 分享圖。
        </p>
      </header>

      <form method="get" className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="url" className="sr-only">
          文章網址
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          defaultValue={url}
          placeholder="https://mamayahuhu.com/..."
          className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-2 text-stone-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        />
        <button
          type="submit"
          className="rounded-lg bg-green-600 px-6 py-2 font-bold text-white transition-colors hover:bg-green-700"
        >
          產生圖片
        </button>
      </form>

      {imageSrc && (
        <section className="flex flex-col items-center gap-4">
          {/* Dynamic API image; next/image optimization adds nothing here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={`${url} 的 Instagram 分享圖`}
            width={1024}
            height={1024}
            className="h-auto w-full max-w-lg rounded-lg border border-stone-200 shadow dark:border-stone-800"
          />
          <a
            href={imageSrc}
            download="mamayahuhu-instagram.png"
            className="text-green-700 underline hover:text-green-800 dark:text-green-400"
          >
            下載圖片
          </a>
        </section>
      )}

      <footer className="mt-auto text-sm text-stone-500">
        API：<code>/api/instagram?url=&lt;文章網址&gt;</code>
      </footer>
    </main>
  );
}
