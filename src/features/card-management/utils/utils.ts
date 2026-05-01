import type { IBankCard } from '@entities/bank-card';
import { getAllCards, logError } from '@shared/lib';

type TCardOperationFunction = () => Promise<void>;

interface IExecuteCardOperationParams {
  operation: TCardOperationFunction;
  errorMessage: string;
  onSuccess: (cards: IBankCard[]) => void;
  context: string;
  cryptoKey: CryptoKey;
}

export const executeCardOperation = async ({
  operation,
  errorMessage,
  onSuccess,
  context,
  cryptoKey,
}: IExecuteCardOperationParams): Promise<void> => {
  try {
    await operation();
    const updatedCards = await getAllCards(cryptoKey);
    onSuccess(updatedCards);
  } catch (error) {
    logError({ message: errorMessage, error, context });
    throw error;
  }
};
