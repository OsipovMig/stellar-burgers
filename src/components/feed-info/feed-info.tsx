import { FC } from 'react';
import { useSelector } from '../../services/store'; // 1. Импортируем useSelector из нашего стора
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // 2. Забираем реальные заказы и счетчики total / totalToday из Redux-стора
  const { orders, total, totalToday } = useSelector((state) => state.feeds);

  // Собираем объект feed в том формате, который ожидает FeedInfoUI по ТЗ
  const feed = {
    total,
    totalToday
  };

  // Фильтруем готовые заказы и заказы в процессе
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed} // Передаем живой объект со счетчиками!
    />
  );
};
