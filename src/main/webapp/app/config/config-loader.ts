import axios from 'axios';
import config from './constants';

export const loadConfig = async () => {
  const axiosResponse = await axios.get(`api/config`);
  config.CLOUD = axiosResponse.data.mode === 'CLOUD';
  return config;
};
