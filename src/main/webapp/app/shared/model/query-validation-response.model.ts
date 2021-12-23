export interface IQueryValidationResponse {
  rawQuery: string;
  validationResultType: string;
  error: string;
}

export const defaultValue: Readonly<IQueryValidationResponse> = {
  rawQuery: '',
  validationResultType: '',
  error: '',
};
