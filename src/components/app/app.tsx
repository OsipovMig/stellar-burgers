import { Routes, Route, Navigate } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages'; // Импортируем все реальные страницы из вашего пакета
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Preloader } from '@ui';

// --- ЗАЩИТА 1: Только для СЕКРЕТНЫХ страниц (Профиль, Заказы) ---
// Допускает только авторизованных пользователей
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = false; // ШАГ 3: свяжем со стором (пока false для проверки редиректов)
  const isLoading = false;

  if (isLoading) return <Preloader />;

  // Если НЕ авторизован — отправляем на логин
  return isAuthenticated ? <>{children}</> : <Navigate to='/login' replace />;
};

// --- ЗАЩИТА 2: Только для ГОСТЕЙ (Логин, Регистрация) ---
// Допускает только НЕавторизованных пользователей
const OnlyUnAuthRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = false; // ШАГ 3: свяжем со стором
  const isLoading = false;

  if (isLoading) return <Preloader />;

  // Если УЖЕ авторизован — отправляем на главную страницу
  return !isAuthenticated ? <>{children}</> : <Navigate to='/' replace />;
};

const App = () => (
  <div className={styles.app}>
    {/* Шапка отображается на всех страницах */}
    <AppHeader />

    <Routes>
      {/* Публичные маршруты */}
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed' element={<Feed />} />
      {/* Маршруты только для НЕавторизованных (Защита от повторного входа) */}
      <Route
        path='/login'
        element={
          <OnlyUnAuthRoute>
            <Login />
          </OnlyUnAuthRoute>
        }
      />
      <Route
        path='/register'
        element={
          <OnlyUnAuthRoute>
            <Register />
          </OnlyUnAuthRoute>
        }
      />{' '}
      {/* Исправлен закрывающий тег */}
      <Route
        path='/forgot-password'
        element={
          <OnlyUnAuthRoute>
            <ForgotPassword />
          </OnlyUnAuthRoute>
        }
      />
      <Route
        path='/reset-password'
        element={
          <OnlyUnAuthRoute>
            <ResetPassword />
          </OnlyUnAuthRoute>
        }
      />
      {/* Маршруты только для АВТОРИЗОВАННЫХ пользователей */}
      <Route
        path='/profile'
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path='/profile/orders'
        element={
          <PrivateRoute>
            <ProfileOrders />
          </PrivateRoute>
        }
      />
      {/* Страница 404 для всех остальных роутов */}
      <Route path='*' element={<NotFound404 />} />
    </Routes>
  </div>
);

export default App;
