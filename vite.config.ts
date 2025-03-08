import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist', // Output directory for built files
    emptyOutDir: true, // Cleans the directory before each build
    lib: {
      entry: 'src/main.js', // Your JavaScript entry point
      name: 'Navigation', // Global variable name when used in non-ES environments
      formats: ['es'], // Outputs as ES modules only
      fileName: (format) => `navigation.${format}.js`, // Output filename
    },
    rollupOptions: {
      plugins: [
        {
          name: 'remove-process env',
          transform(code, id) {
            return code.replace(/process.env.NODE_ENV/g, '"production"');
          },
        },
      ],
    },
  },
  server: {
    cors: true, // Enables CORS during development - good for Webflow integration
  },
});
