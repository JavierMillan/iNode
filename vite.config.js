import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: '/' porque el sitio usa dominio propio (internode.mx).
// Si volviera a servirse desde un subdirectorio, poner '/nombre-repo/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  server: { port: Number(process.env.PORT) || 5173 },
})
