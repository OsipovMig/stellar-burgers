import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/ordersSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '@ui';
import {
  selectOrdersState,
  selectIngredientsData
} from '../../services/selectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const { orders, isLoading } = useSelector(selectOrdersState);
  const ingredients = useSelector(selectIngredientsData);

  useEffect(() => {
    if (!ingredients || ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
    dispatch(fetchUserOrders());

    const interval = setInterval(() => {
      dispatch(fetchUserOrders());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, ingredients]);

  if (
    !ingredients ||
    ingredients.length === 0 ||
    (isLoading && (!orders || orders.length === 0))
  ) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders || []} />;
};
