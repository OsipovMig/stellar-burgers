import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import { orderBurgerApi } from '../../utils/burger-api';

// Асинхронный Thunk для отправки заказа на сервер
export const createOrder = createAsyncThunk(
  'constructor/createOrder',
  async (ingredientsIds: string[], { dispatch }) => {
    const res = await orderBurgerApi(ingredientsIds);
    dispatch(clearConstructor()); // Очищаем корзину после успешной отправки
    return res; // Вернет { success: true, order: TNewOrder, name: string }
  }
);

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean; // Добавили флаг отправки запроса
  orderModalData: any | null; // Добавили хранение данных созданного заказа
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // 1. Экшен добавления ингредиента в корзину
    addIngredient: {
      reducer: (
        state: ConstructorState,
        action: PayloadAction<TConstructorIngredient>
      ) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload; // Если это булка — заменяем текущую булку
        } else {
          state.ingredients.push(action.payload); // Если начинка — добавляем в массив
        }
      },
      // Подготавливаем уникальный id для каждого добавленного продукта (нужно для react-ключей)
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4();
        return { payload: { ...ingredient, id } };
      }
    },
    // 2. Экшен удаления ингредиента из корзины (понадобится для крестиков на карточках)
    removeIngredient: (
      state: ConstructorState,
      action: PayloadAction<string>
    ) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    // 3. Очистить корзину после успешной отправки заказа
    clearConstructor: (state: ConstructorState) => {
      state.bun = null;
      state.ingredients = [];
    },
    // 4. Сброс данных модалки при её закрытии пользователем
    resetOrderModal: (state: ConstructorState) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order; // Сохраняем данные созданного заказа (включая его number)
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
        state.orderModalData = null;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  clearConstructor,
  resetOrderModal
} = constructorSlice.actions;
export default constructorSlice.reducer;
