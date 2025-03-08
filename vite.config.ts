import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    cors: true, // Enables CORS during development - good for Webflow integration
  },
  build: {
    outDir: 'dist', // Output directory for built files
    emptyOutDir: true, // Cleans the directory before each build
    lib: {
      entry: 'src/main.js', // Your JavaScript entry point
      name: 'Navigation', // Global variable name when used in non-ES environments
      formats: ['es'], // Outputs as ES modules only
      fileName: (format) => `navigation.${format}.js`, // Output filename
    },
  },
})
