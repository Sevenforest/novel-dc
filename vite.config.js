import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/novel-dc/',
  server: {
    watch: {
      usePolling: true, // ← これを追記：ファイル変更を強制的に監視する
    },
  },
})
