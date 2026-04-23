import { AppConfig } from '../config/types';
import { getBaseURL } from '../config/environments';

const vitrine1: AppConfig = {
  name: 'Vitrine One',
  type: 'vitrine',
  baseURL: getBaseURL('vitrine1'),
  tags: ['@vitrine', '@vitrine1'],
};

export default vitrine1;
