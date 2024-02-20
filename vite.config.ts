import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // 빌드 후 자동으로 번들 분석 보고서를 열지 여부
      filename: "./dist/stats.html", // 분석 보고서 파일 경로 및 이름
    }),
  ],
});
