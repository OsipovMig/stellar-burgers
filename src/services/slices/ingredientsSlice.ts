import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api'; // Проверьте этот путь до вашего api файла

// Асинхронный Thunk для запроса ингредиентов с сервера
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

interface IngredientsState {
  data: any[];
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
        state.data = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  }
});

export default ingredientsSlice.reducer;
