import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store'; // Добавили useSelector
import { registerUser } from '../../services/slices/userSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  // Достаем ошибку из стора юзера
  const { error } = useSelector((state) => state.user);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!userName || !email || !password) return;
    dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText={error || ''} // Передаем реальный текст ошибки с сервера Практикума
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
