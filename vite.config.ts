import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'dicom-deidentifier',
      formats: ['es', 'cjs'],
    },
  },
});
