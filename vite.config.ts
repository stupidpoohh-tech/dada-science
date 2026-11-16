import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' → 어느 경로(GitHub Pages 하위 경로 포함)에 올려도 동작
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
