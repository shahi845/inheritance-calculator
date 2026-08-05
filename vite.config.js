import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [],

    root: '.',

    server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: 'all',
        watch: {
            usePolling: true,
            interval: 1000
        }
    },

    build: {
        outDir: 'dist',

        rollupOptions: {
            input: 'index.html'
        }
    }
});