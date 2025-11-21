import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from "vite-plugin-dts";
import path from 'path'
import {libInjectCss} from "vite-plugin-lib-inject-css";

export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),//这里必须引入vite-plugin-dts插件，否则不会生成d.ts文件
        dts({tsconfigPath: './tsconfig.app.json'}),
        libInjectCss(),
    ],
    build: {
        outDir: "dist",
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'DynamicForm',
            fileName: (format) => `dynamicform.${format}.js`,
            // cssFileName: 'style.css', // 可选，统一命名
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
