/**

 * Vite config

 * @author prompt-vault team

 * @date 2026-07-07

 */



import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))



export default defineConfig({

  // 桌面端 file:// 加载需要相对路径

  base: './',

  plugins: [vue()],

  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },

  resolve: {

    alias: {

      '@': fileURLToPath(new URL('./src', import.meta.url)),

    },

  },

  build: {

    chunkSizeWarningLimit: 600,

  },

})

