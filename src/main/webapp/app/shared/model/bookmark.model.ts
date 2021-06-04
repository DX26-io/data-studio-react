import { IDatasources, defaultDatasourceValue } from './datasources.model';
import { IUser, defaultValue as userDefaultValue } from './user.model';

export interface IBookmark {
  id?: any;
  name: string;
  user: IUser;
  datasource: IDatasources;
}

export const defaultValue: Readonly<IBookmark> = {
  id: '',
  name: '',
  user: userDefaultValue,
  datasource: defaultDatasourceValue,
};
