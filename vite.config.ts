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
            tsconfigPath: './tsconfig.build.json',
            include: ['src'],  // 确保这个声明文件被处理
            copyDtsFiles: true,               // 让原始 .d.ts 也拷贝到 dist
        }),
        libInjectCss(),
    ],
    server:{
      port:5800
    },
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
                const ext = format === 'es' ? 'mjs' : 'cjs'

                // 核心版放根目录
                if (entryName === 'index') {
                    return `index.${ext}`
                }

                // UI 版本放各自文件夹：naiveUi/index.mjs、elementPlus/index.mjs
                return `${entryName}/index.${ext}`
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
