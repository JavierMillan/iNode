import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: cambiar '/iNode/' por el nombre real del repo de GitHub Pages.
// Si se usa dominio propio o user.github.io raíz, poner '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/iNode/',
  server: { port: Number(process.env.PORT) || 5173 },
})
