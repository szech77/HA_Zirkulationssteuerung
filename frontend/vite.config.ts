import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production'), __VUE_OPTIONS_API__: false, __VUE_PROD_DEVTOOLS__: false, __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false },
  build: {
    target: 'es2022', sourcemap: false,
    outDir: fileURLToPath(new URL('../custom_components/warmwasser_zirkulation/web', import.meta.url)),
    emptyOutDir: true, cssCodeSplit: false,
    lib: { entry: fileURLToPath(new URL('./src/main.ts', import.meta.url)), formats: ['es'], fileName: () => 'panel.js', cssFileName: 'panel' },
  },
  test: { environment: 'jsdom', globals: true, coverage: { exclude: ['src/types.ts'] } },
})
