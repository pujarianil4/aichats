import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


// https://vite.dev/config/
export default defineConfig({
  build: {
    target: "es2020",
  },
  server: {
    host: '0.0.0.0', // This binds the server to all available network interfaces, including your local IP
    port: 5173, // You can leave the default port or choose any other available port
  },
  plugins: [react()],
});
