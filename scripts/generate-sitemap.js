import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

const staticPaths = [
  { url: "/", changefreq: "daily", priority: 0.7 },
  { url: "/menu", changefreq: "monthly", priority: 0.7 },
  { url: "/account-info", changefreq: "monthly", priority: 0.7 },
  { url: "/users", changefreq: "daily", priority: 0.7 },
  { url: "/feeds", changefreq: "daily", priority: 0.7 },
  { url: "/feeds/search", changefreq: "daily", priority: 0.7 },
  { url: "/feeds/filter", changefreq: "daily", priority: 0.7 },
  { url: "/posting", changefreq: "monthly", priority: 0.7 },
  { url: "/join", changefreq: "monthly", priority: 0.7 },
  { url: "/login", changefreq: "monthly", priority: 0.7 },
];

export async function generateSitemap() {
  const stream = new SitemapStream({ hostname: "https://trendik.shop/" });

  return streamToPromise(Readable.from(staticPaths).pipe(stream)).then((data) =>
    data.toString()
  );
}
