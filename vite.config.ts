// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import {libInjectCss} from 'vite-plugin-lib-inject-css'
import path from 'node:path'

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        dts({
            tsconfigPath: './tsconfig.app.json',
        }),
        libInjectCss(),
    ],
    resolve: {
        alias: [{ find: '@', replacement: path.join(__dirname, './src') }],
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    build: {
        outDir: 'dist',
        lib: {
            entry: {
                index: 'src/index.ts',                // 普通版
                naiveUi: 'src/naiveUi/index.ts',      // Naive UI 版
                elementPlus: 'src/elementPlus/index.ts', // Element Plus 版
            },
            name: 'DynamicForm',
            formats: ['es', 'cjs'],                // 👈 多入口建议用这两个
            fileName: (format, entryName) => {
                // 输出：dist/index.mjs / dist/index.cjs / dist/naiveUi.mjs / ...
                if (format === 'es') {
                    return `${entryName}.mjs`
                }
                if (format === 'cjs') {
                    return `${entryName}.cjs`
                }
                return `${entryName}.${format}.js`
            },
        },
        rollupOptions: {
            external: ['vue', 'naive-ui', 'element-plus'], // 👈 外部依赖
            output: {
                globals: {
                    vue: 'Vue',
                    'naive-ui': 'naiveUI',
                    'element-plus': 'ElementPlus',
                },
            },
        },
    },
})
