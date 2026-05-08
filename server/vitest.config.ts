import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    fileParallelism: false,
    include: ['src/**/test.ts', 'src/**/*.spec.ts'],
    env: {
      DATABASE: process.env.DATABASE,
      PORT: '3001',
      JWT_SECRET: process.env.JWT_SECRET ?? 'test-secret',
    },
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/generated/**', 'src/index.ts'],
    },
  },
})
