export interface IChannelProperty {
  displayName: string;
  fieldName: string;
  order: number;
  fieldType: string;
  required: boolean;
}

export const defaultValue: Readonly<IChannelProperty> = {
  displayName: '',
  fieldName: '',
  order: 0,
  fieldType: '',
  required: false,
};
