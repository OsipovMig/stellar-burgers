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
import { checkUserAuth } from '../../services/userSlice'; // Импортируем проверку токена

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
    return <Preloader />; // Пока идет запрос проверки токена, крутим спиннер
  }

  // Если пользователя нет в сторе — отправляем на /login,
  // сохраняя в state адрес страницы, куда он хотел попасть (location)
  return user ? (
    <>{children}</>
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

// 2. НАСТОЯЩИЙ ONLY UN-AUTH ROUTE (Только для гостей: логин, регистрация)
const OnlyUnAuthRoute = ({ children }: PrivateRouteProps) => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если пользователь УЖЕ авторизован, не пускаем его на форму логина,
  // а возвращаем либо откуда он пришел (from), либо на главную страницу "/"
  if (user) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading: isIngredientsLoading, error } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth()); // 3. При первой загрузке проверяем, залогинен ли юзер
  }, [dispatch]);

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

      {/* ... Код блока с модальными окнами {background && (...)} ниже остается без изменений ... */}
    </div>
  );
};

export default App;
