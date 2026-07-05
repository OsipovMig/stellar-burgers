import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
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
        <NavLink
          to='/'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''} text text_type_main-default pt-4 pb-4 pr-5 pl-5`
          }
        >
          {({ isActive }) => (
            <>
              {}
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='ml-2 mr-10'>Конструктор</span>
            </>
          )}
        </NavLink>

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
