import type { IBankCard } from '@entities/bank-card';
import { getAllCards, logError } from '@shared/lib';

type CardOperationFunction = () => Promise<void>;

interface IExecuteCardOperationParams {
  operation: CardOperationFunction;
  errorMessage: string;
  onSuccess: (cards: IBankCard[]) => void;
  context: string;
}

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
