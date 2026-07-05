import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice'; // Импортируем загрузку ингредиентов

export const Feed: FC = () => {
  const dispatch = useDispatch();

  // Достаем заказы из слайса feeds и ингредиенты со склада
  const { orders, isLoading } = useSelector((state) => state.feeds);
  const ingredients = useSelector((state) => state.ingredients.data);

  useEffect(() => {
    // Если склад ингредиентов пуст, сначала обязательно загружаем его!
    if (!ingredients || ingredients.length === 0) {
      dispatch(fetchIngredients());
    }

    dispatch(fetchFeed());

    // ТЗ: Обновление в режиме реального времени каждые 5 секунд
    const interval = setInterval(() => {
      dispatch(fetchFeed());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, ingredients]);

  // ЖЁСТКАЯ ЗАЩИТА: пока ингредиенты со склада НЕ ДОЛЕТЕЛИ,
  // мы не пускаем код дальше, чтобы внутренние счётчики Практикума не упали в ошибку!
  if (
    !ingredients ||
    ingredients.length === 0 ||
    (isLoading && (!orders || orders.length === 0))
  ) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders || []}
      handleGetFeeds={() => dispatch(fetchFeed())}
    />
  );
};
