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
import { fetchUserOrders } from './ordersSlice';

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

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
        state.orders = [];
        state.isAuthChecked = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        let ordersArray: TOrder[] = [];

        if (Array.isArray(action.payload)) {
          ordersArray = action.payload;
        } else if (action.payload && typeof action.payload === 'object') {
          ordersArray =
            (action.payload as any).orders ||
            (action.payload as any).data ||
            [];
        }

        state.orders = ordersArray;
      });
  }
});

export default userSlice.reducer;
