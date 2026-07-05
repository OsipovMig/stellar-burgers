import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/ordersSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  // Достаем массив заказов и склад ингредиентов напрямую из Redux
  const { orders, isLoading } = useSelector((state) => state.orders);
  const ingredients = useSelector((state) => state.ingredients.data);

  useEffect(() => {
    // Гарантируем наличие ингредиентов со склада для подсчета стоимости бургеров по ТЗ
    if (!ingredients || ingredients.length === 0) {
      dispatch(fetchIngredients());
    }

    dispatch(fetchUserOrders());

    // ТЗ: «Обновляется в режиме реального времени» каждые 5 секунд
    const interval = setInterval(() => {
      dispatch(fetchUserOrders());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, ingredients]);

  // Пока склад ингредиентов или личные заказы еще летят по сети — крутим лоадер
  if (
    !ingredients ||
    ingredients.length === 0 ||
    (isLoading && (!orders || orders.length === 0))
  ) {
    return <Preloader />;
  }

  // Передаем строго проверенный массив заказов в оригинальный интерфейс Практикума
  return <ProfileOrdersUI orders={orders || []} />;
};
