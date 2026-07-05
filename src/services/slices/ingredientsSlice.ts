import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types'; // Импортируем готовый тип Практикума

// Асинхронный Thunk для получения ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async () => {
    const response = await getIngredientsApi();
    return response; // Автоматически возвращает чистый массив TIngredient[]
  }
);

interface IngredientsState {
  data: TIngredient[]; // Строго типизируем массив
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  data: [],
  isLoading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload; // Данные сохраняются в стейт
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export default ingredientsSlice.reducer;
