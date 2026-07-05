import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store'; // 1. Импортируем useDispatch
import { loginUser } from '../../services/slices/userSlice'; // 2. Импортируем Thunk авторизации

export const Login: FC = () => {
  const dispatch = useDispatch(); // 3. Инициализируем dispatch

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // 4. Оживляем кнопку: отправляем собранные email и пароль в Redux
    if (email && password) {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
