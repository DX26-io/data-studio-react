import { IChannelProperty } from './channel-parameters.model';
export interface IChannel {
  id: string;
  connectionProperties: Array<IChannelProperty>;
}

export const defaultValue: Readonly<IChannel> = {
  id: '',
  connectionProperties: [],
};
