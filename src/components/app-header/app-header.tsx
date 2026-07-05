import { FC } from 'react';
import { useSelector } from '../../services/store'; // 1. Импортируем useSelector из нашего стора
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  // 2. Берем данные пользователя из Redux Стора
  const { user } = useSelector((state) => state.user);

  // 3. Если пользователь авторизован, передаем его имя, иначе — пустую строку
  return <AppHeaderUI userName={user ? user.name : ''} />;
};
