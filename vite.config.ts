import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsxPlugin from "@vitejs/plugin-vue-jsx";

// https://vite.dev/config/
export default defineConfig({
  server:{
    port:6001
  },
  plugins: [vue(),vueJsxPlugin()],
})
