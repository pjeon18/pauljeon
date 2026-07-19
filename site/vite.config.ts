import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH is set by the GitHub Pages workflow ("/pauljeon/"); defaults to "/" for local dev
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
