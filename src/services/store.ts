import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import constructorReducer from './slices/constructorSlice';

// ВОТ ЭТОТ ИМПОРТ ДОЛЖЕН БЫТЬ ТАКИМ:
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook, // Связываем оригинальный хук с именем dispatchHook
  useSelector as selectorHook // Связываем оригинальный хук с именем selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
  // Прописываем под обоими ключами, чтобы ожить и Ленту, и Конструктор
  feed: feedReducer,
  feeds: feedReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
