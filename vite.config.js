import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base must match the GitHub repo name so all asset paths resolve correctly on Pages
  base: '/Vinsite/',
})
