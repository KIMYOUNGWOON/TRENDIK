import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import { resolve } from "path";

// 사이트의 URL 목록
const urls = [
  { url: "/", changefreq: "daily", priority: 0.7 },
  { url: "/menu", changefreq: "monthly", priority: 0.7 },
  { url: "/account-info", changefreq: "monthly", priority: 0.7 },
  { url: "/users", changefreq: "daily", priority: 0.7 },
  { url: "/users/:userId", changefreq: "daily", priority: 0.7 },
  { url: "/users/:userId/:select", changefreq: "daily", priority: 0.7 },
  { url: "/feeds", changefreq: "daily", priority: 0.7 },
  { url: "/feeds/search", changefreq: "daily", priority: 0.7 },
  { url: "/feeds/filter", changefreq: "daily", priority: 0.7 },
  { url: "/feeds/:postId", changefreq: "daily", priority: 0.7 },
  { url: "/feeds/:postId/edit", changefreq: "daily", priority: 0.7 },
  { url: "/:userId/picks", changefreq: "daily", priority: 0.7 },
  { url: "/posting", changefreq: "monthly", priority: 0.7 },
  { url: "/join", changefreq: "monthly", priority: 0.7 },
  { url: "/login", changefreq: "monthly", priority: 0.7 },
];

async function generateSitemap() {
  // SitemapStream 인스턴스 생성
  const smStream = new SitemapStream({ hostname: "https://www.example.com" });

  // sitemap.xml 파일로 스트림 저장
  const writeStream = createWriteStream(resolve("./public", "sitemap.xml"));
  smStream.pipe(writeStream);

  urls.forEach((url) => {
    smStream.write(url);
  });

  smStream.end();

  // 스트림이 완료될 때까지 대기
  await streamToPromise(smStream);

  console.log("Sitemap generated successfully!");
}

generateSitemap().catch((error) => {
  console.error("Failed to generate sitemap:", error);
});
