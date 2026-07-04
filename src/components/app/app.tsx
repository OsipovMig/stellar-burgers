import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom';
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
} from '@pages'; // Убрали отсюда IngredientDetails и OrderInfo
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal } from '@components';
import { Preloader } from '@ui';

interface PrivateRouteProps {
  children: React.ReactNode;
}

// Временные заглушки для контента внутри модалок (чтобы сборщик не ругался)
const IngredientDetails = () => (
  <div className='text text_type_main-medium pt-10'>Детали ингредиента</div>
);
const OrderInfo = () => (
  <div className='text text_type_main-medium pt-10'>Информация о заказе</div>
);

// Защита для авторизованных
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = false;
  const isLoading = false;

  if (isLoading) return <Preloader />;

  return isAuthenticated ? <>{children}</> : <Navigate to='/login' replace />;
};

// Защита для гостей
const OnlyUnAuthRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = false;
  const isLoading = false;

  if (isLoading) return <Preloader />;

  return !isAuthenticated ? <>{children}</> : <Navigate to='/' replace />;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const background =
    location.state && (location.state as { background?: Location }).background;

  const handleModalClose = () => navigate(-1);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Отдельные страницы по прямым ссылкам */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Защищенные гостевые маршруты */}
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

        {/* Защищенные приватные маршруты */}
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

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные маршруты поверх бэкграунда */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
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
