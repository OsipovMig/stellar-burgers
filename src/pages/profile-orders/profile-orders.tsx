import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/ordersSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const { orders, isLoading } = useSelector((state) => state.orders);
  const ingredients = useSelector((state) => state.ingredients.data);

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
