import { FC } from 'react';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  // Достаем имя пользователя из стора, если он авторизован
  const { user } = useSelector((state) => state.user);

  // Передаем имя. Компонент AppHeaderUI от Практикума сам подтянет
  // навигацию, используя глобальный контекст маршрутизатора!
  return <AppHeaderUI userName={user ? user.name : ''} />;
};
