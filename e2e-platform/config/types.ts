export type AppType = 'ecommerce' | 'saas' | 'vitrine';

export type Environment = 'dev' | 'staging' | 'prod';

export interface AppConfig {
  name: string;
  type: AppType;
  baseURL: string;
  credentials?: {
    email: string;
    password: string;
  };
  tags?: string[];
}

export interface EnvironmentConfig {
  baseURLOverrides?: Partial<Record<string, string>>;
}
