import { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store'; // Импортируем хуки из вашего store.ts
import { fetchIngredients } from '../../services/slices/ingredientsSlice'; // Импортируем наш Thunk

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
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal } from '@components';
import { Preloader } from '@ui';

interface PrivateRouteProps {
  children: React.ReactNode;
}

// Заглушки для авторизации (оставляем из Шага 2)
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = false;
  if (isAuthenticated) return <>{children}</>;
  return <Navigate to='/login' replace />;
};

const OnlyUnAuthRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = false;
  if (!isAuthenticated) return <>{children}</>;
  return <Navigate to='/' replace />;
};

// Заглушки для внутренностей модалок
const IngredientDetails = () => (
  <div className='text text_type_main-medium pt-10'>Детали ингредиента</div>
);
const OrderInfo = () => (
  <div className='text text_type_main-medium pt-10'>Информация о заказе</div>
);

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Получаем dispatch для отправки экшена
  const dispatch = useDispatch();

  // 2. Берем состояние загрузки и ошибку из Redux Стора
  const { isLoading, error } = useSelector((state) => state.ingredients);

  // 3. Запускаем асинхронный запрос к API при первой загрузке приложения
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const background =
    location.state && (location.state as { background?: Location }).background;
  const handleModalClose = () => navigate(-1);

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* 4. Хороший UX: если данные еще грузятся — показываем прелоадер */}
      {isLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          Произошла ошибка: {error}
        </div>
      ) : (
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />

          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />

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

      {/* Модальные маршруты поверх бэкграунда */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10000
                }}
              >
                <div
                  style={{
                    background: '#1c1c21',
                    padding: '40px',
                    borderRadius: '16px',
                    border: '1px solid #4c4c5a',
                    position: 'relative'
                  }}
                >
                  <button
                    onClick={handleModalClose}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '20px'
                    }}
                  >
                    ✕
                  </button>
                  <Modal title='Информация о заказе' onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                </div>
              </div>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10000
                }}
              >
                <div
                  style={{
                    background: '#1c1c21',
                    padding: '40px',
                    borderRadius: '16px',
                    border: '1px solid #4c4c5a',
                    position: 'relative'
                  }}
                >
                  <button
                    onClick={handleModalClose}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '20px'
                    }}
                  >
                    ✕
                  </button>
                  <Modal title='Детали ингредиента' onClose={handleModalClose}>
                    <IngredientDetails />
                  </Modal>
                </div>
              </div>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <PrivateRoute>
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10000
                  }}
                >
                  <div
                    style={{
                      background: '#1c1c21',
                      padding: '40px',
                      borderRadius: '16px',
                      border: '1px solid #4c4c5a',
                      position: 'relative'
                    }}
                  >
                    <button
                      onClick={handleModalClose}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '20px'
                      }}
                    >
                      ✕
                    </button>
                    <Modal
                      title='Информация о заказе'
                      onClose={handleModalClose}
                    >
                      <OrderInfo />
                    </Modal>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
