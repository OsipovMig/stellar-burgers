import { test, expect } from '@playwright/test';

const MOCK_ACCESS_TOKEN = 'Bearer mock-jwt-access-token';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token';
const MOCK_ORDER_NUMBER = '77777';
const MOCK_ORDER_NAME = 'Космический бургер'; // Единое имя для всех моков

const BASE_URL = 'http://localhost:4000';

const MOCK_INGREDIENTS_DATA = {
  success: true,
  data: [
    {
      _id: '643d69a5c3b7b9002d8a3c83',
      name: 'Краторная булка N-200i',
      type: 'bun',
      price: 1255,
      image: ''
    },
    {
      _id: '643d69a5c3b7b9002d8a3c84',
      name: 'Филе Марсианской Макрели',
      type: 'main',
      price: 3000,
      image: ''
    }
  ]
};

test.describe('Интеграционные тесты страницы конструктора Stellar Burgers', () => {
  test.beforeEach(async ({ page, context }, testInfo) => {
    await page.routeFromHAR('tests/hars/api.har', {
      url: '**/api/**',
      update: false,
      notFound: 'abort'
    });

    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_INGREDIENTS_DATA)
      });
    });

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

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: MOCK_ORDER_NAME,
          order: { number: Number(MOCK_ORDER_NUMBER) }
        })
      });
    });

    await page.route(/(png|jpg|jpeg|svg|webp|avif)$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      });
    });

    if (testInfo.title.includes('Полный цикл создания заказа')) {
      await context.addInitScript((token) => {
        window.localStorage.setItem('refreshToken', token);
      }, MOCK_REFRESH_TOKEN);
    }
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
        'li:has-text("Котлета"), li:has-text("Филе"), li:has-text("Мясо"), li:has-text("Соус"), li:has-text("Макрели")'
      )
      .locator('text=Добавить')
      .first();

    await expect(bunBtn).toBeVisible({ timeout: 10000 });

    await bunBtn.dispatchEvent('click');
    await mainBtn.dispatchEvent('click');

    await expect(
      page.locator('text=Краторная булка N-200i (верх)')
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.locator('text=Краторная булка N-200i (низ)')
    ).toBeVisible();
    await expect(
      page
        .locator('.constructor-element__text')
        .filter({ hasText: 'Филе Марсианской Макрели' })
    ).toBeVisible();
  });

  test('Открытие и закрытие модального окна с описанием ингредиента', async ({
    page
  }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    const bunCard = page
      .locator('li:has-text("Краторная булка N-200i")')
      .first();
    await expect(bunCard).toBeVisible({ timeout: 10000 });
    await bunCard.click();

    const modalContainer = page.locator('#modals');
    await expect(modalContainer).toContainText('Детали ингредиента', {
      timeout: 5000
    });

    await expect(
      modalContainer.locator('h3', { hasText: 'Краторная булка N-200i' })
    ).toBeVisible();

    const closeButton = modalContainer
      .locator('button, [class*="close"], svg')
      .first();
    await closeButton.click({ force: true });
    await expect(modalContainer).toBeEmpty();

    await bunCard.click();
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
    await page.waitForLoadState('domcontentloaded');

    const bunBtn = page
      .locator('li:has-text("булка")')
      .locator('text=Добавить')
      .first();
    const mainBtn = page
      .locator(
        'li:has-text("Котлета"), li:has-text("Филе"), li:has-text("Мясо"), li:has-text("Соус"), li:has-text("Макрели")'
      )
      .locator('text=Добавить')
      .first();

    await bunBtn.dispatchEvent('click');
    await mainBtn.dispatchEvent('click');

    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await orderButton.click();

    await expect(page.getByText(MOCK_ORDER_NUMBER)).toBeVisible({
      timeout: 15000
    });

    const closeButton = page
      .locator('#modals')
      .locator('button, [class*="close"], svg')
      .first();
    await closeButton.click({ force: true });
    await expect(page.locator('#modals')).toBeEmpty();

    await expect(page.locator('text=(верх)')).not.toBeVisible();
  });
});
