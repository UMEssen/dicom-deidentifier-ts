import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: 'src/index.ts',
      name: 'dicom-deidentifier',
      formats: ['es', 'cjs'],
    },
  },
});