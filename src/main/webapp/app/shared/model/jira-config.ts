export interface IJiraConfig {
  id?: any;
  organization?: string;
  key?: string;
  userName?: string;
  apiToken?: string;
}

export const defaultValue: Readonly<IJiraConfig> = {
  id: '',
  organization: '',
  key: '',
  userName: '',
  apiToken: '',
};
