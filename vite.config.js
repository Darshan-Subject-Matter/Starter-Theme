import { defineConfig } from 'vite';
import path from 'path';
import { unlinkSync, existsSync } from 'fs';

export default defineConfig({
  build: {
    outDir: 'assets',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/main.js'),
      },
      output: {
        entryFileNames: 'main.js',
        assetFileNames: (assetInfo) => {
          // Rename CSS to main.css
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'main.css';
          }
          return assetInfo.name;
        },
      },
    },
    cssCodeSplit: false,
    watch: {
      // Ignore output directory and node_modules to prevent watch loops
      // This ensures Vite doesn't rebuild when it writes to assets/
      exclude: ['**/assets/**', '**/node_modules/**', '**/.git/**'],
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    watch: {
      ignored: ['**/assets/**', '**/node_modules/**'],
    },
  },
  plugins: [
    {
      name: 'remove-js-file',
      closeBundle() {
        // Remove the empty main.js file after build
        const jsPath = path.resolve(__dirname, 'assets/main.js');
        if (existsSync(jsPath)) {
          unlinkSync(jsPath);
        }
      },
    },
  ],
});

