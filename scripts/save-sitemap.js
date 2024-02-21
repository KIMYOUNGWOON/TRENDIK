import fs from "fs";
import path from "path";
import { generateSitemap } from "./generate-sitemap.js";

// 사이트맵 생성 및 파일로 저장
async function saveSitemap() {
  const sitemap = await generateSitemap(); // 사이트맵 생성
  fs.writeFileSync(path.resolve("public", "sitemap.xml"), sitemap); // 파일로 저장
  console.log("Sitemap has been saved successfully.");
}

saveSitemap().catch(console.error);
