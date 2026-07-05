import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { TIngredient, TOrder } from '@utils-types';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';
import { getOrderByNumberApi } from '../../utils/burger-api'; // Импортируем API запроса по номеру

export const OrderInfo: FC = () => {
  // Достаем динамический номер заказа из адресной строки роутера (:number)
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  // Локальный стейт для хранения найденного заказа
  const [orderData, setOrderData] = useState<TOrder | null>(null);

  // 1. Достаем склад ингредиентов и массивы заказов из глобального Redux-стора
  const ingredients = useSelector((state) => state.ingredients.data);
  const feedOrders = useSelector((state) => state.feeds.orders);
  const profileOrders = useSelector((state) => state.orders.orders);

  // 2. Если пользователь зашел по прямой ссылке, принудительно качаем склад ингредиентов
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients]);

  // 3. Логика поиска информации о заказе по его номеру
  useEffect(() => {
    if (!number) return;
    const parsedNumber = parseInt(number, 10);

    // Сначала ищем заказ локально в Redux (если перешли с Ленты или Истории)
    const localOrder =
      feedOrders.find((item) => item.number === parsedNumber) ||
      profileOrders.find((item) => item.number === parsedNumber);

    if (localOrder) {
      setOrderData(localOrder);
    } else {
      // Если локально заказа нет (прямой переход по ссылке на чистом кэше) — запрашиваем API Яндекса
      getOrderByNumberApi(parsedNumber)
        .then((res) => {
          if (res?.orders && res.orders.length > 0) {
            setOrderData(res.orders[0]); // Записываем первый найденный заказ с сервера
          }
        })
        .catch((err) =>
          console.error('Ошибка при получении данных заказа:', err)
        );
    }
  }, [number, feedOrders, profileOrders]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce<TIngredientsWithCount>(
      (acc, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
