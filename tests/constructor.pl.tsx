import { test, expect } from '@playwright/test';

const MOCK_ACCESS_TOKEN = 'Bearer mock-jwt-access-token';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token';

const BASE_URL = 'http://localhost:4000';

test.describe('Интеграционные тесты страницы конструктора Stellar Burgers', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/api.har', {
      url: '**/api/**',
      update: false,
      notFound: 'fallback'
    });

    await page.route(/(png|jpg|jpeg|svg|webp|avif)$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      });
    });
  });

  test('Должно работать добавление булок и начинок из списка в конструктор', async ({
    page
  }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    const bunBtn = page
      .locator('li:has-text("булка")')
      .locator('text=Добавить')
      .first();
    const mainBtn = page
      .locator(
        'li:has-text("Котлета"), li:has-text("Филе"), li:has-text("Мясо"), li:has-text("Соус")'
      )
      .locator('text=Добавить')
      .first();

    await expect(bunBtn).toBeVisible({ timeout: 10000 });

    await bunBtn.dispatchEvent('click');
    await mainBtn.dispatchEvent('click');

    await expect(page.locator('text=(верх)')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=(низ)')).toBeVisible();
  });

  test('Открытие и закрытие модального окна с описанием ингредиента', async ({
    page
  }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    const bunCard = page.locator('a[href*="/ingredients/"]').first();
    await expect(bunCard).toBeVisible({ timeout: 10000 });

    await bunCard.click({ position: { x: 5, y: 5 } });

    const modalContainer = page.locator('#modals');
    await expect(modalContainer).toContainText('Детали ингредиента', {
      timeout: 5000
    });

    await expect(modalContainer.locator('h3').last()).not.toBeEmpty();

    const closeButton = modalContainer
      .locator('button, [class*="close"], svg')
      .first();
    await closeButton.click({ force: true });
    await expect(modalContainer).toBeEmpty();

    await bunCard.click({ position: { x: 5, y: 5 } });
    await expect(modalContainer).not.toBeEmpty();

    await page.mouse.click(0, 0);
    await expect(modalContainer).toBeEmpty();
  });

  test('Полный цикл создания заказа авторизованным пользователем', async ({
    page,
    context
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: encodeURIComponent(MOCK_ACCESS_TOKEN),
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.goto(BASE_URL);

    await page.evaluate((token) => {
      localStorage.setItem('refreshToken', token);
    }, MOCK_REFRESH_TOKEN);

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@yandex.ru', name: 'Тестировщик' }
        })
      });
    });

    await page.route('**/api/auth/token', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          accessToken: MOCK_ACCESS_TOKEN,
          refreshToken: MOCK_REFRESH_TOKEN
        })
      });
    });

    await page.route(/\/orders|\/order/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Космический бургер',
          order: { number: 77777 }
        })
      });
    });

    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    const bunBtn = page
      .locator('li:has-text("булка")')
      .locator('text=Добавить')
      .first();
    const mainBtn = page
      .locator(
        'li:has-text("Котлета"), li:has-text("Филе"), li:has-text("Мясо"), li:has-text("Соус")'
      )
      .locator('text=Добавить')
      .first();

    await bunBtn.dispatchEvent('click');
    await mainBtn.dispatchEvent('click');

    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await orderButton.click();

    const modalContainer = page.locator('#modals');

    await expect(modalContainer.locator('text=77777')).toBeVisible({
      timeout: 15000
    });

    const closeButton = modalContainer
      .locator('button, [class*="close"], svg')
      .first();
    await closeButton.click({ force: true });
    await expect(modalContainer).toBeEmpty();

    await expect(page.locator('text=(верх)')).not.toBeVisible();
  });
});
