import { defineConfig } from 'tsup'
import { resolve } from 'node:path'

export default defineConfig({
  entry: { cli: 'cli/index.ts' },
  outDir: 'dist',
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  banner: {
    js: '#!/usr/bin/env node',
  },
  outExtension: () => ({ js: '.mjs' }),
  clean: true,
  // Bundle CLI deps into the binary so npx users get a single self-contained file
  noExternal: ['@ai-sdk/deepseek', 'ai', '@clack/prompts'],
  esbuildOptions(options) {
    options.alias = { '@': resolve('./src') }
  },
})
