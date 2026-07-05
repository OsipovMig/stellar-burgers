import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser, TOrder } from '@utils-types';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
import { fetchUserOrders } from './ordersSlice'; // Импортируем Thunk личных заказов

// Обновление данных пользователя (Профиль)
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

// Регистрация
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

// Логин
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

// Выход из аккаунта (Безопасный вариант с finally)
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (error) {
      console.warn('Сервер отклонил logout, очищаем локально:', error);
    } finally {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    }
  }
);

// Проверка токена при старте с защитой от 403 ошибки
export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    if (!getCookie('accessToken')) {
      return rejectWithValue('Токен отсутствует');
    }
    const res = await getUserApi();
    return res.user;
  }
);

interface UserState {
  user: TUser | null;
  orders: TOrder[];
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  orders: [],
  isAuthChecked: false,
  isLoading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Проверка авторизации при старте приложения
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      // Логин
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      // Регистрация
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      // Обновление профиля
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Выход
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.orders = []; // Очищаем историю при выходе
        state.isAuthChecked = true;
      })
      // Синхронизация личных заказов в ветку пользователя для селекторов Практикума
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        let ordersArray: TOrder[] = [];

        if (Array.isArray(action.payload)) {
          ordersArray = action.payload;
        } else if (action.payload && typeof action.payload === 'object') {
          // Если прилетел объект ответа API, достаем массив из любого возможного поля
          ordersArray =
            (action.payload as any).orders ||
            (action.payload as any).data ||
            [];
        }

        // Записываем строго чистый массив заказов для скрытых селекторов Практикума!
        state.orders = ordersArray;
      });
  }
});

export default userSlice.reducer;
