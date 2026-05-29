import { defineConfig } from 'tsup'
import { resolve } from 'node:path'

export default defineConfig({
  entry: { cli: 'src/index.ts' },
  outDir: 'dist',
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  banner: {
    js: '#!/usr/bin/env node',
  },
  outExtension: () => ({ js: '.js' }),
  clean: true,
  noExternal: [
    '@agent-md/shared',
  ],
  esbuildOptions(options) {
    options.alias = {
      '@agent-md/shared': resolve('../../packages/shared/src/index.ts'),
    }
  },
})
