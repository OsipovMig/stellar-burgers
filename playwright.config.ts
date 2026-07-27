import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // ИСПРАВЛЕНО: Теперь используются только стандартные маски.
  // Файл constructor.spec.tsx подхватится автоматически!
  testMatch: ['**/*.spec.ts?(x)', '**/*.test.ts?(x)'],
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
