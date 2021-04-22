export interface ITeamConfig {
  id?: any;
  webhookName: string;
  webhookURL: string;
}

export const defaultValue: Readonly<ITeamConfig> = {
  id: '',
  webhookName: '',
  webhookURL: '',
};
