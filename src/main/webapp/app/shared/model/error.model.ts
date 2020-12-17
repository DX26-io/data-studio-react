export interface IError {
  translationKey: string;
  isValid: boolean;
}

export const defaultValue: Readonly<IError> = {
  translationKey: '',
  isValid: true,
};
