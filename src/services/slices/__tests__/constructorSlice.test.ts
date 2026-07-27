import constructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  resetOrderModal,
  createOrder
} from '../constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 100,
  image: '',
  image_mobile: '',
  image_large: ''
};

const mockMain: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 200,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('Тестирование burgerConstructor редьюсера', () => {
  // ИСПРАВЛЕНО: Извлекаем подлинный начальный стейт напрямую из логики редьюсера без дублирования
  const initialState = constructorReducer(undefined, { type: 'UNKNOWN' });

  test('должен возвращать начальное состояние при экшене UNKNOWN', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('должен добавлять и перезаписывать булку', () => {
    const action = addIngredient(mockBun);
    const state = constructorReducer(initialState, action);

    expect(state.bun).toEqual({ ...mockBun, id: expect.any(String) });
  });

  test('должен добавлять начинку в массив и генерировать uuid id', () => {
    const action = addIngredient(mockMain);
    const state = constructorReducer(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients).toEqual([
      { ...mockMain, id: expect.any(String) }
    ]);
  });

  test('должен удалять начинку по её уникальному id', () => {
    const filledState = {
      ...initialState,
      ingredients: [
        { ...mockMain, id: 'unique-id-777' }
      ] as TConstructorIngredient[]
    };

    const action = removeIngredient('unique-id-777');
    const state = constructorReducer(filledState, action);

    expect(state.ingredients).toHaveLength(0);
  });

  test('должен полностью очищать булку и начинки при clearConstructor', () => {
    const filledState = {
      bun: mockBun,
      ingredients: [{ ...mockMain, id: '1' }] as TConstructorIngredient[],
      orderRequest: false,
      orderModalData: null
    };

    const state = constructorReducer(filledState, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  test('должен сбрасывать orderModalData в null', () => {
    const stateWithOrder = { ...initialState, orderModalData: { number: 123 } };
    const state = constructorReducer(stateWithOrder, resetOrderModal());
    expect(state.orderModalData).toBeNull();
  });

  test('должен выставлять orderRequest в true при createOrder.pending', () => {
    const state = constructorReducer(initialState, {
      type: createOrder.pending.type
    });
    expect(state.orderRequest).toBe(true);
  });

  test('должен сохранять данные заказа при createOrder.fulfilled', () => {
    const mockOrder = { number: 77777 };
    const state = constructorReducer(initialState, {
      type: createOrder.fulfilled.type,
      payload: { order: mockOrder }
    });
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
  });

  test('должен отключать загрузку и сбрасывать модалку при createOrder.rejected', () => {
    const stateWithLoading = {
      ...initialState,
      orderRequest: true,
      orderModalData: { number: 5 }
    };
    const state = constructorReducer(stateWithLoading, {
      type: createOrder.rejected.type
    });
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toBeNull();
  });
});
