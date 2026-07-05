import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import constructorReducer from './slices/constructorSlice';
import ordersReducer from './slices/ordersSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// ЭТАЛОННАЯ СТРУКТУРА ХРАНИЛИЩА ПО ТЗ ПРАКТИКУМА
const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  feeds: feedReducer,
  burgerConstructor: constructorReducer,
  orders: ordersReducer,
  profileOrders: ordersReducer
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
