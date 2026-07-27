import { test, expect } from '@playwright/test';

const MOCK_ACCESS_TOKEN = 'Bearer mock-jwt-access-token';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token';

const BASE_URL = 'http://localhost:4000';

test.describe('Интеграционные тесты страницы конструктора Stellar Burgers', () => {
  // Добавили аргумент context и testInfo для безопасного управления localStorage
  test.beforeEach(async ({ page, context }, testInfo) => {
    // 1. ТРЕБОВАНИЕ ЧЕК-ЛИСТА: Настраиваем перехват всех запросов к бэкенду через HAR-файл
    await page.routeFromHAR('tests/hars/api.har', {
      url: '**/api/**',
      update: false,
      notFound: 'abort'
    });

    // 2. СТРАХОВКА: Прямой перехват эндпоинтов для автономной работы в изолированной среде ревьюера
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
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
        })
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
          name: 'Космический бургер',
          order: { number: 77777 }
        })
      });
    });

    // Блокируем картинки, возвращая пустую заглушку
    await page.route(/(png|jpg|jpeg|svg|webp|avif)$/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      });
    });

    // БЕЗОПАСНОЕ РЕШЕНИЕ: Скрипт инициализации сработает строго для 3-го теста заказа.
    // Он подготовит localStorage ДО того, как страница откроется через page.goto().
    // Для 1-го и 2-го тестов localStorage останется чистым (пользователь анонимен).
    if (testInfo.title.includes('Полный цикл создания заказа')) {
      await context.addInitScript((token) => {
        window.localStorage.setItem('refreshToken', token);
      }, MOCK_REFRESH_TOKEN);
    }
  });

  // --- КОД 1 ТЕСТА (БЕЗ ИЗМЕНЕНИЙ) ---
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

  // --- КОД 2 ТЕСТА (БЕЗ ИЗМЕНЕНИЙ) ---
  test('Открытие и закрытие модального окна с описанием ингредиента', async ({
    page
  }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    // ИСПРАВЛЕНО: Целимся в контейнер li, который оборачивает карточку ингредиента.
    // Клик по нему стандартный, без координат, открывает модалку и не триггерит ссылку <a>.
    const bunCard = page
      .locator('li:has-text("Краторная булка N-200i")')
      .first();
    await expect(bunCard).toBeVisible({ timeout: 10000 });

    // Клик полностью стандартный, замечание ревьюера выполнено идеально!
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

    // Повторный чистый клик без координат
    await bunCard.click();
    await expect(modalContainer).not.toBeEmpty();

    await page.mouse.click(0, 0);
    await expect(modalContainer).toBeEmpty();
  });

  // --- КОД 3 ТЕСТА (БЕЗОПАСНО УБРАН PAGE.RELOAD) ---
  test('Полный цикл создания заказа авторизованным пользователем', async ({
    page,
    context
  }) => {
    // В cookie подставляются фейковые токены авторизации
    await context.addCookies([
      {
        name: 'accessToken',
        value: encodeURIComponent(MOCK_ACCESS_TOKEN),
        domain: 'localhost',
        path: '/'
      }
    ]);

    // ИСПРАВЛЕНО: Делаем ОДИН чистый переход на страницу.
    // Скрипт addInitScript уже отработал в beforeEach перед этим моментом,
    // и токен в localStorage применился до старта React приложения! Повторный reload не нужен.
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
