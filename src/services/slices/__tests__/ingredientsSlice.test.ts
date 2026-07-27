import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3b7b9002d8a3c83',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('Тестирование ingredientsSlice редьюсера', () => {
  const initialState = {
    data: [],
    isLoading: false,
    error: null
  };

  test('должен возвращать начальное состояние при экшене UNKNOWN', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('должен устанавливать isLoading в true при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен сохранять данные в data и отключать isLoading при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockIngredients);
  });

  test('должен записывать текст ошибки в error при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сервера' }
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сервера');
  });
});
