import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  // Достаем массив заказов
  const { orders } = useSelector((state) => state.feed);

  // Запрашиваем данные СТРОГО один раз при монтировании компонента.
  // Пустой массив зависимостей [] гарантирует, что зацикливания не произойдет!
  useEffect(() => {
    dispatch(fetchFeed());
  }, []); // Убрали все зависимости, чтобы остановить вечный цикл

  // Передаем данные. Если массив еще пуст, FeedUI просто покажет пустую сетку,
  // но страница НЕ зависнет, и шапка останется полностью рабочей!
  return (
    <FeedUI
      orders={orders || []}
      handleGetFeeds={() => dispatch(fetchFeed())}
    />
  );
};
