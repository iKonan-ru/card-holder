import type { ICardType } from '@entities/card-type';
import { getAllCardTypes, logError } from '@shared/lib';

type TCardTypeOperationFunction = () => Promise<void>;

interface IExecuteCardTypeOperationParams {
  operation: TCardTypeOperationFunction;
  errorMessage: string;
  onSuccess: (cardTypes: ICardType[]) => void;
  context: string;
  cryptoKey: CryptoKey;
}

export const executeCardTypeOperation = async ({
  operation,
  errorMessage,
  onSuccess,
  context,
  cryptoKey,
}: IExecuteCardTypeOperationParams): Promise<void> => {
  try {
    await operation();
    const updatedCardTypes = await getAllCardTypes(cryptoKey);
    onSuccess(updatedCardTypes);
  } catch (error) {
    logError({ message: errorMessage, error, context });
    throw error;
  }
};
