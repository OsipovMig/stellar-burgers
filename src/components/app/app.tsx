import { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';

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
} from '@pages';
import styles from './app.module.css';

import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { Preloader } from '@ui';

interface PrivateRouteProps {
  children: React.ReactNode;
}

// 1. НАСТОЯЩИЙ PRIVATE ROUTE (Только для залогиненных)
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return user ? (
    <>{children}</>
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

// 2. НАСТОЯЩИЙ ONLY UN-AUTH ROUTE (Только для гостей)
const OnlyUnAuthRoute = ({ children }: PrivateRouteProps) => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (user) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading: isIngredientsLoading, error } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  // Считываем фоновое состояние для модалок
  const background =
    location.state && (location.state as { background?: Location }).background;

  const handleModalClose = () => navigate(-1);

  return (
    <div className={styles.app}>
      <AppHeader />

      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          Произошла ошибка: {error}
        </div>
      ) : (
        /* Если открыта модалка, фиксируем фон на background, иначе используем текущий location */
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />

          {/* Прямые страницы (без модалок) для детальной информации */}
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />

          {/* Авторизация */}
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
          />
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

          {/* Личный кабинет */}
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

          {/* ТЗ: Прямой переход на маршрут истории, доступный только авторизованным */}
          <Route
            path='/profile/orders/:number'
            element={
              <PrivateRoute>
                <OrderInfo />
              </PrivateRoute>
            }
          />

          <Route path='*' element={<NotFound404 />} />
        </Routes>
      )}

      {/* --- СЕКЦИЯ МОДАЛЬНЫХ МАРШРУТОВ ПОВЕРХ ОСНОВНОГО ФОНА ПО ТЗ --- */}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <PrivateRoute>
                <Modal title='Информация о заказе' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </PrivateRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
