import { FC } from 'react';
import { useParams } from 'react-router-dom'; // 1. Импортируем useParams для чтения :id из URL
import { useSelector } from '../../services/store'; // 2. Импортируем useSelector из нашего стора
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  // 3. Достаем ID ингредиента из адресной строки (например, из /ingredients/643d69a5c1674b0027e25715)
  const { id } = useParams<{ id: string }>();

  // 4. Забираем массив всех загруженных с сервера ингредиентов из Redux
  const ingredients = useSelector((state) => state.ingredients.data);

  // 5. Ищем среди них конкретный ингредиент по его уникальному ID
  const ingredientData = ingredients.find((item) => item._id === id) || null;

  // Если данные с сервера ещё не успели долететь, показываем лоадер
  if (!ingredientData) {
    return <Preloader />;
  }

  // 6. Передаем реальный объект ингредиента в готовый интерфейс Практикума
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
