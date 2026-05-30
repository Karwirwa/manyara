import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@jsr/hono__hono': path.resolve(__dirname, 'src/mocks/@jsr_hono__hono.js'),
      '@jsr/supabase__supabase-js': path.resolve(__dirname, 'src/mocks/@jsr_supabase__supabase-js.js'),
    },
  },
})