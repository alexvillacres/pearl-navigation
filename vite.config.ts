import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        lib: {
            entry: 'src/main.ts',
            name: 'Navigation',
            formats: ['es'],
            fileName: (format) => `navigation.${format}.js`
        }
    },
});