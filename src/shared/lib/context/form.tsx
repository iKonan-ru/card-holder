/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  type FC,
  type PropsWithChildren,
} from 'react';

type TFieldChangeHandler = (name: string, value: string) => void;
type TFieldValidateHandler = (name: string, error: string | undefined) => void;

export interface IFormContext {
  onChange?: TFieldChangeHandler;
  onValidate?: TFieldValidateHandler;
}

const Form = createContext<IFormContext>({
  onChange: undefined,
  onValidate: undefined,
});

interface IFormProviderProps extends PropsWithChildren {
  onChange?: TFieldChangeHandler;
  onValidate?: TFieldValidateHandler;
}

export const FormProvider: FC<IFormProviderProps> = ({
  onChange,
  onValidate,
  children,
}) => {
  const contextValue = useMemo(
    () => ({ onChange, onValidate }),
    [onChange, onValidate],
  );

  return <Form.Provider value={contextValue}>{children}</Form.Provider>;
};

export const useFormContext = (): IFormContext => {
  const context = useContext(Form);

  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }

  return useContext(Form);
};
