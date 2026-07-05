import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

// Асинхронный Thunk для получения личной истории заказов пользователя
import { getCookie } from '../../utils/cookie'; // Импортируем утилиту чтения кук

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    const token = getCookie('accessToken');

    // Если токена в куках нет — не делаем запрос к серверу, чтобы не ловить 401 Unauthorized!
    if (!token) {
      return rejectWithValue(
        'Пользователь не авторизован или токен отсутствует'
      );
    }

    try {
      const response = await getOrdersApi();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

interface OrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders', // Строго совпадает с ключом в combineReducers
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        // Напрямую берем массив из payload, так как функция getOrdersApi в burger-api уже вытащила его!
        state.orders = action.payload || [];
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки истории заказов';
      });
  }
});

export default ordersSlice.reducer;
