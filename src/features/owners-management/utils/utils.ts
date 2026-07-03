import type { IOwner } from '@entities/card-owner';
import { getAllOwners, logError } from '@shared/lib';

type TOwnerOperationFunction = () => Promise<void>;

interface IExecuteOwnerOperationParams {
  operation: TOwnerOperationFunction;
  errorMessage: string;
  onSuccess: (owners: IOwner[]) => void;
  context: string;
  cryptoKey: CryptoKey;
}

export const executeOwnerOperation = async ({
  operation,
  errorMessage,
  onSuccess,
  context,
  cryptoKey,
}: IExecuteOwnerOperationParams): Promise<void> => {
  try {
    await operation();
    const updatedOwners = await getAllOwners(cryptoKey);
    onSuccess(updatedOwners);
  } catch (error) {
    logError({ message: errorMessage, error, context });
    throw error;
  }
};
