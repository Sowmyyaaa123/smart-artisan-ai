import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: ["smart-artisan-ai.onrender.com"],
  },
});
