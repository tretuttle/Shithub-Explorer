import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Configure base URL for GitHub Pages deployment
  base: mode === 'production' ? '/Shithub-Explorer/' : '/',
  
  server: {
    host: "::",
    port: 8080,
  },
  
  build: {
    // Ensure proper output directory for GitHub Pages
    outDir: 'dist',
    // Generate source maps for debugging
    sourcemap: false,
    // Optimize for production
    minify: 'esbuild',
    // Ensure assets are properly referenced
    assetsDir: 'assets',
    // Handle large assets
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Organize chunks for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar'],
        },
      },
    },
  },
  
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));
