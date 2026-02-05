import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// Catalog microfrontend (products, product detail, collections, about).
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'catalog',
      filename: 'remoteEntry.js',
      exposes: {
        './Products': './src/pages/Products.jsx',
        './ProductDetail': './src/pages/ProductDetail.jsx',
        './Collections': './src/pages/Collections.jsx',
        './About': './src/pages/About.jsx',
      },
      // IMPORTANT: share runtime libs as singletons.
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
        'react-router-dom': { singleton: true },
        '@emotion/react': { singleton: true },
        '@emotion/styled': { singleton: true },
        '@mui/material': { singleton: true },
        // NOTE: do not share `@mui/icons-material`.
        // Reason: avoid federation dev crash when it can't infer a version for this package.
      },
    }),
  ],
  server: {
    port: 5175,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    sourcemap: true,
  },
});

