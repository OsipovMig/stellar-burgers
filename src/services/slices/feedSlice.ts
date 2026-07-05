import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export const fetchFeed = createAsyncThunk('feed/fetch', async () => {
  const response = await getFeedsApi();
  return response;
});

interface FeedState {
  orders: TOrder[];
  feeds: TOrder[]; // Добавили ключ feeds
  data: TOrder[]; // Добавили ключ data
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  feeds: [],
  data: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feeds', // <--- ИСПРАВИЛИ НА 'feeds'
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;

        // Достаем массив заказов из любого возможного места в ответе API
        const ordersArray =
          action.payload?.orders || (action.payload as any)?.data || [];

        // Заполняем абсолютно все поля для стопроцентной совместимости с UI Практикума
        state.orders = ordersArray;
        state.feeds = ordersArray;
        state.data = ordersArray;

        state.total = action.payload?.total || 0;
        state.totalToday = action.payload?.totalToday || 0;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты';
      });
  }
});

export default feedSlice.reducer;
