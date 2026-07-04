import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice'; // Импортируем наш новый редюсер

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Объединяем редюсеры (сейчас он один, дальше добавятся новые)
const rootReducer = combineReducers({
  ingredients: ingredientsReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// Исправляем тип RootState, чтобы он правильно видел структуру хранилища
export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
