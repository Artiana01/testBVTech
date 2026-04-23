import { test as base, expect } from '@playwright/test';
import { AppConfig } from '../config/types';
import { LoginPage } from '../pages/saas/LoginPage';
import { CartPage } from '../pages/ecommerce/CartPage';
import { DashboardPage } from '../pages/saas/DashboardPage';
import { ProductPage } from '../pages/ecommerce/ProductPage';
import { CheckoutPage } from '../pages/ecommerce/CheckoutPage';
import { HomePage } from '../pages/vitrine/HomePage';
import { NavigationPage } from '../pages/common/NavigationPage';

type PageObjects = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  homePage: HomePage;
  navigationPage: NavigationPage;
  appConfig: AppConfig;
};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  navigationPage: async ({ page }, use) => use(new NavigationPage(page)),

  // Injected per test via `test.use({ appConfig: myApp })`
  appConfig: [undefined as unknown as AppConfig, { option: true }],
});

export { expect };
