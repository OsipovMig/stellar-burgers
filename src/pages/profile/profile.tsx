import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store'; // 1. Импортируем хуки Redux
import { updateUser } from '../../services/slices/userSlice'; // 2. Импортируем экшен обновления

export const Profile: FC = () => {
  const dispatch = useDispatch();

  // 3. Достаем реального пользователя из Redux-хранилища
  const { user } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  // Синхронизируем форму, если данные пользователя в сторе изменились
  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  // Проверяем, были ли изменены поля формы относительно данных в сторе
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  // 4. ТЗ: При нажатии кнопки «Сохранить» отправляется запрос с измененными данными
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!formValue.name || !formValue.email) return;

    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password
      })
    );
  };

  // 5. ТЗ: При нажатии «Отмена» значения полей возвращаются в состояние до редактирования
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
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
      handleCancel={handleCancel} // Исправили имя пропса на handleCancelClick для интерфейса Практикума
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
