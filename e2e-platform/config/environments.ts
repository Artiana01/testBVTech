import { Environment } from './types';

const ENV = (process.env.TEST_ENV as Environment) || 'dev';

const baseURLs: Record<string, Record<Environment, string>> = {
  shop1: {
    dev: 'http://localhost:3000',
    staging: 'https://staging-shop1.example.com',
    prod: 'https://shop1.example.com',
  },
  saas1: {
    dev: 'http://localhost:3001',
    staging: 'https://staging-saas1.example.com',
    prod: 'https://saas1.example.com',
  },
  vitrine1: {
    dev: 'http://localhost:3002',
    staging: 'https://staging-vitrine1.example.com',
    prod: 'https://vitrine1.example.com',
  },
};

export function getBaseURL(appKey: string): string {
  const override = process.env[`BASE_URL_${appKey.toUpperCase()}`];
  if (override) return override;

  const urls = baseURLs[appKey];
  if (!urls) throw new Error(`Unknown app key: "${appKey}". Add it to config/environments.ts`);

  return urls[ENV];
}

export { ENV };
