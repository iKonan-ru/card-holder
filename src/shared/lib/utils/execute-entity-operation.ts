import { logError } from './logger';

type TOperationFunction = () => Promise<void>;

interface IExecuteEntityOperationParams<T> {
  operation: TOperationFunction;
  refetch: () => Promise<T[]>;
  errorMessage: string;
  onSuccess: (items: T[]) => void;
  context: string;
}

export const executeEntityOperation = async <T>({
  operation,
  refetch,
  errorMessage,
  onSuccess,
  context,
}: IExecuteEntityOperationParams<T>): Promise<void> => {
  try {
    await operation();
    const updatedItems = await refetch();
    onSuccess(updatedItems);
  } catch (error) {
    logError({ message: errorMessage, error, context });
    throw error;
  }
};
