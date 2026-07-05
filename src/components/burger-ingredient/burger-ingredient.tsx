import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store'; // 1. Импортируем useDispatch
import { addIngredient } from '../../services/slices/constructorSlice'; // 2. Импортируем экшен добавления

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch(); // 3. Инициализируем dispatch

    // 4. Логика клика: отправляем выбранный продукт в Redux-корзину!
    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
