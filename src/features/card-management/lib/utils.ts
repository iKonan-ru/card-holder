import type { IBankCard } from '@entities/bank-card';
import { getAllCards, logError } from '@shared/lib';

type CardOperationFunction = () => Promise<void>;

interface IExecuteCardOperationParams {
  operation: CardOperationFunction;
  errorMessage: string;
  onSuccess: (cards: IBankCard[]) => void;
  context: string;
}

/**
 * Выполняет операцию с карточкой и обновляет список карт после успешного выполнения
 * Логирует ошибку и пробрасывает её дальше при неудаче
 * @param params - Параметры операции
 * @param params.operation - Асинхронная функция выполняющая операцию
 * @param params.errorMessage - Сообщение об ошибке
 * @param params.onSuccess - Коллбэк вызываемый при успехе с обновлённым списком карт
 * @param params.context - Контекст выполнения операции
 * @returns Промис без значения
 * @throws Ошибка если операция не удалась
 */
export const executeCardOperation = async ({
  operation,
  errorMessage,
  onSuccess,
  context,
}: IExecuteCardOperationParams): Promise<void> => {
  try {
    await operation();
    const updatedCards = await getAllCards();
    onSuccess(updatedCards);
  } catch (error) {
    logError({ message: errorMessage, error, context });
    throw error;
  }
};
