export interface IEmailConfig {
  id?: any;
  host?: string;
  sender?: string;
  user?: string;
  password?: string;
}

export const defaultValue: Readonly<IEmailConfig> = {
  id: '',
  host: '',
  sender: '',
  user: '',
  password: '',
};
