import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          /**
           * Keep the heavy third-party libraries out of the critical path.
           *
           * Route-level React.lazy took the initial chunk from 3,239 kB to
           * 1,723 kB; what remains is largely vendor code that the homepage
           * does not need in order to paint. Firebase is only reached when
           * someone signs in with Google, the maps SDK only on the pages that
           * draw a map, and motion only where something animates.
           *
           * The traveler this matters to is on a Sinai mobile network — the
           * same connectivity the api client's 8s timeout was written for.
           */
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('firebase') || id.includes('@firebase')) return 'vendor-firebase';
            if (id.includes('@vis.gl') || id.includes('google-maps')) return 'vendor-maps';
            if (id.includes('@google/genai')) return 'vendor-genai';
            if (id.includes('motion') || id.includes('framer')) return 'vendor-motion';
            if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            return undefined;
          }
        }
      },
      // The route chunks are already split; this stops the warning from firing
      // on the vendor bundles, which are cached across every navigation.
      chunkSizeWarningLimit: 900
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
