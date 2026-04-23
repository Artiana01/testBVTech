/**
 * apps/ecommerce/pages/AdminPage.ts
 * -----------------------------------
 * Page Object pour le back-office administrateur (/admin).
 * Couvre : dashboard KPIs, CRUD produits, gestion utilisateurs.
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class AdminPage extends BasePage {

  // --- Sélecteurs Dashboard ---
  private readonly kpiTotalProducts  = '[data-testid="kpi-total-products"]';   // 👉 ADAPTER
  private readonly kpiActiveProducts = '[data-testid="kpi-active-products"]';  // 👉 ADAPTER
  private readonly kpiInactiveProds  = '[data-testid="kpi-inactive-products"]';// 👉 ADAPTER
  private readonly kpiTotalUsers     = '[data-testid="kpi-total-users"]';      // 👉 ADAPTER
  private readonly stockAlerts       = '[data-testid="stock-alerts"]';         // 👉 ADAPTER

  // --- Sélecteurs Liste produits ---
  private readonly productsTable     = '[data-testid="products-table"]';       // 👉 ADAPTER
  private readonly productRow        = '[data-testid="product-row"]';          // 👉 ADAPTER
  private readonly editProductBtn    = '[data-testid="edit-product-btn"]';     // 👉 ADAPTER
  private readonly productActiveToggle = '[data-testid="product-active-toggle"]'; // 👉 ADAPTER

  // --- Sélecteurs Formulaire produit ---
  private readonly productNameInput  = 'input[name="name"]';                  // 👉 ADAPTER
  private readonly productDescInput  = 'textarea[name="description"]';        // 👉 ADAPTER
  private readonly productPriceInput = 'input[name="price"]';                 // 👉 ADAPTER
  private readonly productStockInput = 'input[name="stock"]';                 // 👉 ADAPTER
  private readonly categorySelect    = 'select[name="category"]';             // 👉 ADAPTER
  private readonly imageUpload       = 'input[type="file"]';                  // 👉 ADAPTER
  private readonly activeToggle      = 'input[name="active"]';                // 👉 ADAPTER
  private readonly submitProductBtn  = '[data-testid="submit-product-btn"]';  // 👉 ADAPTER

  // --- Sélecteurs Gestion utilisateurs ---
  private readonly usersTable        = '[data-testid="users-table"]';         // 👉 ADAPTER
  private readonly userRow           = '[data-testid="user-row"]';            // 👉 ADAPTER
  private readonly userEmail         = '[data-testid="user-email"]';          // 👉 ADAPTER
  private readonly userRole          = '[data-testid="user-role"]';           // 👉 ADAPTER

  constructor(page: Page) {
    super(page);
  }

  // =========================================================
  // NAVIGATION
  // =========================================================

  async gotoDashboard(): Promise<void> {
    await this.navigate('/admin');
    await this.waitForLoad();
  }

  async gotoProducts(): Promise<void> {
    await this.navigate('/admin/products');
    await this.waitForLoad();
  }

  async gotoNewProduct(): Promise<void> {
    await this.navigate('/admin/products/new');
    await this.waitForLoad();
  }

  async gotoUsers(): Promise<void> {
    await this.navigate('/admin/users');
    await this.waitForLoad();
  }

  // =========================================================
  // DASHBOARD KPIs
  // =========================================================

  async verifyKpisVisible(): Promise<void> {
    // Vérifier que les 4 KPIs principaux sont affichés
    await expect(this.page.locator(this.kpiTotalProducts)).toBeVisible();   // 👉 ADAPTER
    await expect(this.page.locator(this.kpiActiveProducts)).toBeVisible();  // 👉 ADAPTER
    await expect(this.page.locator(this.kpiTotalUsers)).toBeVisible();      // 👉 ADAPTER
  }

  async verifyKpiHasValue(kpiSelector: string): Promise<void> {
    const el = this.page.locator(kpiSelector);
    const text = await el.innerText();
    // Vérifier que le KPI contient un nombre
    expect(parseInt(text, 10)).toBeGreaterThanOrEqual(0);
  }

  async verifyStockAlertsIfPresent(): Promise<void> {
    // Les alertes de stock sont optionnelles (n'existent que si des produits sont en rupture)
    const alerts = this.page.locator(this.stockAlerts);
    if (await alerts.isVisible()) {
      // 👉 ADAPTER : vérifier le contenu des alertes si elles sont présentes
      await expect(alerts).toContainText(/low.stock|out.of.stock|rupture|stock faible/i);
    }
  }

  // =========================================================
  // LISTE DES PRODUITS
  // =========================================================

  async verifyProductsListVisible(): Promise<void> {
    await expect(this.page.locator(this.productsTable)).toBeVisible(); // 👉 ADAPTER
  }

  async getProductsCount(): Promise<number> {
    return await this.page.locator(this.productRow).count();
  }

  async verifyProductInList(productName: string): Promise<void> {
    await expect(
      this.page.locator(this.productRow).filter({ hasText: productName })
    ).toBeVisible({ timeout: 5_000 });
  }

  async clickEditProduct(productName?: string): Promise<void> {
    if (productName) {
      const row = this.page.locator(this.productRow).filter({ hasText: productName });
      await row.locator(this.editProductBtn).click();
    } else {
      // Cliquer sur le premier bouton modifier
      await this.page.locator(this.editProductBtn).first().click();
    }
    await this.page.waitForLoadState('load');
  }

  /**
   * Récupère le prix affiché d'un produit dans la liste admin.
   */
  async getProductPriceInList(productName: string): Promise<number> {
    const row = this.page.locator(this.productRow).filter({ hasText: productName });
    // 👉 ADAPTER : sélecteur de la colonne prix dans le tableau
    const priceText = await row.locator('[data-testid="product-price"]').innerText();
    return parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.'));
  }

  // =========================================================
  // TOGGLE ACTIF / INACTIF
  // =========================================================

  async toggleFirstProductActive(): Promise<void> {
    const toggle = this.page.locator(this.productActiveToggle)
      .or(this.page.locator('input[type="checkbox"][name*="active"]'))
      .or(this.page.getByRole('switch'));
    await toggle.first().click();
    await this.page.waitForTimeout(800);
  }

  async toggleProductActive(productName: string): Promise<void> {
    const row = this.page.locator(this.productRow).filter({ hasText: productName });
    const toggle = row.locator(this.productActiveToggle)
      .or(row.locator('input[type="checkbox"]'))
      .or(row.getByRole('switch'));
    await toggle.click();
    await this.page.waitForTimeout(800);
  }

  // =========================================================
  // FORMULAIRE PRODUIT (Création / Modification)
  // =========================================================

  async fillProductForm(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category?: string;
  }): Promise<void> {
    await this.page.locator(this.productNameInput)
      .or(this.page.getByLabel(/nom du produit|product name/i))
      .fill(data.name);

    await this.page.locator(this.productDescInput)
      .or(this.page.getByLabel(/description/i))
      .fill(data.description);

    await this.page.locator(this.productPriceInput)
      .or(this.page.getByLabel(/prix|price/i))
      .fill(String(data.price));

    await this.page.locator(this.productStockInput)
      .or(this.page.getByLabel(/stock/i))
      .fill(String(data.stock));

    if (data.category) {
      const catEl = this.page.locator(this.categorySelect);
      if (await catEl.isVisible()) {
        await catEl.selectOption({ label: data.category });
      } else {
        await this.page.getByLabel(/catégorie|category/i).fill(data.category); // 👉 ADAPTER si autocomplete
      }
    }
  }

  async activateProductToggle(): Promise<void> {
    // 👉 ADAPTER : le toggle peut être un <input type="checkbox"> ou un <Switch> custom
    const toggle = this.page.locator(this.activeToggle)
      .or(this.page.getByRole('switch', { name: /actif|active|publié/i }))
      .or(this.page.getByLabel(/actif|active|publié/i));
    if (!(await toggle.isChecked())) {
      await toggle.click();
    }
  }

  async submitProductForm(): Promise<void> {
    const btn = this.page.locator(this.submitProductBtn)
      .or(this.page.getByRole('button', { name: /créer|sauvegarder|enregistrer|save|submit/i }));
    await btn.click();
    await this.page.waitForLoadState('load');
  }

  async updateProductPrice(newPrice: number): Promise<void> {
    const priceField = this.page.locator(this.productPriceInput)
      .or(this.page.getByLabel(/prix|price/i));
    await priceField.clear();
    await priceField.fill(String(newPrice));
    await this.submitProductForm();
  }

  // =========================================================
  // GESTION UTILISATEURS
  // =========================================================

  async verifyUsersListVisible(): Promise<void> {
    await expect(this.page.locator(this.usersTable)).toBeVisible(); // 👉 ADAPTER
  }

  async verifyUserInList(email: string): Promise<void> {
    await expect(
      this.page.locator(this.userRow).filter({ hasText: email })
    ).toBeVisible({ timeout: 5_000 });
  }

  async verifyUserHasRole(email: string, role: string): Promise<void> {
    const row = this.page.locator(this.userRow).filter({ hasText: email });
    await expect(row.locator(this.userRole)).toContainText(role, { ignoreCase: true });
  }

  // =========================================================
  // VÉRIFICATIONS ACCÈS
  // =========================================================

  async verifyAdminAccessDenied(): Promise<void> {
    // Un utilisateur non-admin doit être redirigé ou voir une erreur 403
    const isRedirected = !this.page.url().includes('/admin');
    const hasForbidden = await this.page.getByText(/403|accès refusé|forbidden|not authorized/i).isVisible();
    expect(isRedirected || hasForbidden).toBeTruthy();
  }
}
