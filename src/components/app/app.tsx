import { Routes, Route, Navigate } from 'react-router-dom';
import { ConstructorPage } from '@pages';
import '../../index.css'; // Вернули правильный путь на 2 уровня вверх
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Preloader } from '@ui';

// --- ШАГ 1: КАРКАС ЗАЩИЩЕННОГО МАРШРУТА ---
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = true; // На Шаге 2 завяжем на Redux/Store
  const isLoading = false;

  if (isLoading) {
    return <Preloader />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to='/login' replace />;
};
// ------------------------------------------

// Временные заглушки для страниц
const LoginPage = () => (
  <div className='text text_type_main-medium pt-10'>
    Страница входа (В разработке)
  </div>
);
const RegisterPage = () => (
  <div className='text text_type_main-medium pt-10'>
    Страница регистрации (В разработке)
  </div>
);
const ProfilePage = () => (
  <div className='text text_type_main-medium pt-10'>
    Личный кабинет (Защищенный маршрут)
  </div>
);
const NotFoundPage = () => (
  <div className='text text_type_main-medium pt-10'>
    404: Страница не найдена
  </div>
);

const App = () => (
  <div className={styles.app}>
    {/* Шапка отображается на всех страницах */}
    <AppHeader />

    <Routes>
      {/* Главная страница — Конструктор бургеров */}
      <Route path='/' element={<ConstructorPage />} />

      {/* Публичные маршруты */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      {/* Защищенные маршруты (Стрелочная функция без фигурных скобок для линтера) */}
      <Route
        path='/profile'
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      {/* Обработка 404 */}
      <Route path='/404' element={<NotFoundPage />} />
      <Route path='*' element={<Navigate to='/404' replace />} />
    </Routes>
  </div>
);

export default App;
