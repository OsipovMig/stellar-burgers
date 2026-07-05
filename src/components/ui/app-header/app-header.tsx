import React, { FC } from 'react';
import { NavLink } from 'react-router-dom'; // 1. Импортируем NavLink для переключения страниц по ТЗ
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        {/* 2. Настраиваем ссылку на Конструктор (главную страницу) */}
        <NavLink
          to='/'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''} text text_type_main-default pt-4 pb-4 pr-5 pl-5`
          }
        >
          {({ isActive }) => (
            <>
              {/* Меняем тип иконки в зависимости от активности страницы */}
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='ml-2 mr-10'>Конструктор</span>
            </>
          )}
        </NavLink>

        {/* 3. Настраиваем ссылку на Ленту заказов */}
        <NavLink
          to='/feed'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''} text text_type_main-default pt-4 pb-4 pr-5 pl-5`
          }
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='ml-2'>Лента заказов</span>
            </>
          )}
        </NavLink>
      </div>

      <div className={styles.logo}>
        <Logo className='' />
      </div>

      <div className={styles.link_position_last}>
        {/* 4. Настраиваем ссылку на Личный кабинет (Либо /profile, либо на /login если не авторизован) */}
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''} text text_type_main-default pt-4 pb-4 pr-5 pl-5`
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='ml-2'>{userName || 'Личный кабинет'}</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
