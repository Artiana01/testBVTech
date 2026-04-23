import { AppConfig } from '../config/types';
import { getBaseURL } from '../config/environments';

const shop1: AppConfig = {
  name: 'Shop One',
  type: 'ecommerce',
  baseURL: getBaseURL('shop1'),
  credentials: {
    email: process.env.SHOP1_USER_EMAIL || 'test@shop1.com',
    password: process.env.SHOP1_USER_PASSWORD || 'password123',
  },
  tags: ['@ecommerce', '@shop1'],
};

export default shop1;
