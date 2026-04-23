import { AppConfig } from '../config/types';
import { getBaseURL } from '../config/environments';

const saas1: AppConfig = {
  name: 'SaaS One',
  type: 'saas',
  baseURL: getBaseURL('saas1'),
  credentials: {
    email: process.env.SAAS1_USER_EMAIL || 'admin@saas1.com',
    password: process.env.SAAS1_USER_PASSWORD || 'admin123',
  },
  tags: ['@saas', '@saas1'],
};

export default saas1;
