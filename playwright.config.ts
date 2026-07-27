import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Папка, в которой Playwright будет искать тесты
  testDir: './tests',

  // Добавляем вашу маску, чтобы он принудительно прочитал файл .pl.tsx
  testMatch: ['**/*.spec.ts?(x)', '**/*.test.ts?(x)', '**/constructor.pl.tsx'],

  // Репортер для вывода результатов (по умолчанию в консоль и HTML-отчет при падении)
  reporter: 'html',

  use: {
    // URL вашего локально запущенного приложения Stellar Burgers
    baseURL: 'http://localhost:4000',
    // ИСПРАВЛЕНО: правильное название режима скриншотов в актуальных версиях Playwright
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },

  // Запуск в Chromium (Chrome), этого достаточно для локальной проверки
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
