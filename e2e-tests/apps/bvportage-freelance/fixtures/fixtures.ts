import { test as base, Page } from '@playwright/test';
import { LoginPage } from './pages/common/LoginPage';
import { SignupPage } from './pages/common/SignupPage';
import { DashboardFreelancePage } from './pages/freelance/DashboardFreelancePage';
import { PackPage } from './pages/freelance/PackPage';
import { ClientPage } from './pages/freelance/ClientPage';
import { ProjectPage } from './pages/freelance/ProjectPage';
import { MissionPage } from './pages/freelance/MissionPage';
import { ContractPage } from './pages/freelance/ContractPage';
import { KycPage } from './pages/freelance/KycPage';
import { InvoicePage } from './pages/freelance/InvoicePage';
import { ProfilePage } from './pages/freelance/ProfilePage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

type Pages = {
  loginPage: LoginPage;
  signupPage: SignupPage;
  dashboardFreelancePage: DashboardFreelancePage;
  packPage: PackPage;
  clientPage: ClientPage;
  projectPage: ProjectPage;
  missionPage: MissionPage;
  contractPage: ContractPage;
  kycPage: KycPage;
  invoicePage: InvoicePage;
  profilePage: ProfilePage;
  adminDashboardPage: AdminDashboardPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  dashboardFreelancePage: async ({ page }, use) => {
    await use(new DashboardFreelancePage(page));
  },
  packPage: async ({ page }, use) => {
    await use(new PackPage(page));
  },
  clientPage: async ({ page }, use) => {
    await use(new ClientPage(page));
  },
  projectPage: async ({ page }, use) => {
    await use(new ProjectPage(page));
  },
  missionPage: async ({ page }, use) => {
    await use(new MissionPage(page));
  },
  contractPage: async ({ page }, use) => {
    await use(new ContractPage(page));
  },
  kycPage: async ({ page }, use) => {
    await use(new KycPage(page));
  },
  invoicePage: async ({ page }, use) => {
    await use(new InvoicePage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  adminDashboardPage: async ({ page }, use) => {
    await use(new AdminDashboardPage(page));
  },
});

export { expect } from '@playwright/test';
