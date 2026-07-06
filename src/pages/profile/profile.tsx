import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';
import { selectUserState } from '../../services/selectors';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  // Достаем актуальные данные пользователя через именованный селектор по ТЗ
  const { user } = useSelector(selectUserState);

  // Стейт полей ввода формы
  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  // Синхронизируем форму, когда данные пользователя успешно обновились в Redux
  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '' // Пароль принудительно сбрасываем в пустую строку
      });
    }
  }, [user?.name, user?.email]);

  // Вычисляем изменения: кнопки видны ТОЛЬКО если инпуты отличаются от Redux
  const isFormChanged = user
    ? formValue.name !== user.name ||
      formValue.email !== user.email ||
      formValue.password !== ''
    : false;

  // Отправка формы на сервер Практикума
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!formValue.name || !formValue.email) return;

    try {
      // Дожидаемся успешного выполнения запроса сохранения на сервере
      await dispatch(updateUser(formValue)).unwrap();

      // ИСПРАВЛЕНИЕ: очищаем локальный пароль сразу после успешного ответа сервера.
      // Благодаря этому флаг isFormChanged станет false, и кнопки МГНОВЕННО ИСЧЕЗНУТ!
      setFormValue((prev) => ({
        ...prev,
        password: ''
      }));
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
    }
  };

  // Сброс изменений (кнопка Отмена)
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
