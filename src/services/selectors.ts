import { RootState } from './store';

export const selectOrdersState = (state: RootState) => state.orders;

export const selectIngredientsData = (state: RootState) =>
  state.ingredients.data;

export const selectFeedsState = (state: RootState) => state.feeds;

export const selectUserState = (state: RootState) => state.user;
