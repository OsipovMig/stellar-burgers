import { FC, memo } from 'react';
import { useDispatch } from '../../services/store'; // 1. Импортируем useDispatch из нашего стора
import { removeIngredient } from '../../services/slices/constructorSlice'; // 2. Импортируем экшен удаления
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch(); // 3. Инициализируем dispatch

    const handleMoveDown = () => {};

    const handleMoveUp = () => {};

    // 4. Оживляем функцию закрытия: отправляем уникальный id ингредиента в Redux
    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
