import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  updateUserApi, // Объединили импорт здесь
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';

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

// Проверка токена при старте
export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  const res = await getUserApi();
  return res.user;
});

// Выход из аккаунта
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
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
      // Проверка авторизации
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
      })
      // Регистрация
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Обновление профиля (Добавили сохранение измененных данных в стейт)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Выход
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export default userSlice.reducer;
