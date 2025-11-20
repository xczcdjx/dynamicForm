import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'DynamicForm',
      fileName: (format) => `dynamicform.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'naive-ui'],   // 👈 不要把这些打包进去
      output: {
        globals: {
          vue: 'Vue',
          'naive-ui': 'naiveUI'
        }
      }
    }
  }
})
