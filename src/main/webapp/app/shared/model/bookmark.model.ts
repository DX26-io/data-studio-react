import { IDatasources, defaultDatasourceValue } from './datasources.model';
import { IUser, defaultValue as userDefaultValue } from './user.model';

export interface IBookmark {
  id?: any;
  name: string;
  featureCriteria: any;
  user: IUser;
  datasource: IDatasources;
}

export const defaultValue: Readonly<IBookmark> = {
  id: '',
  name: '',
  featureCriteria: null,
  user: userDefaultValue,
  datasource: defaultDatasourceValue,
};
