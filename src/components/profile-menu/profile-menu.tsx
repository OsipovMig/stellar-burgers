import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Добавили useNavigate
import { useDispatch } from '../../services/store'; // Импортируем useDispatch из стора
import { logoutUser } from '../../services/slices/userSlice'; // Импортируем экшен выхода
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Оживляем кнопку выхода
  const handleLogout = () => {
    dispatch(logoutUser()); // Запускаем очистку кук и токенов
    navigate('/login'); // Перенаправляем пользователя на страницу входа
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
