/**
 * apps/ecommerce/pages/CartPage.ts
 * ----------------------------------
 * Page Object pour la page panier (/cart).
 * Couvre : affichage des articles, modification quantité, suppression, sous-total.
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../shared/pages/BasePage';

export class CartPage extends BasePage {

  // --- Sélecteurs ---
  private readonly cartItem         = '[data-testid="cart-item"]';              // 👉 ADAPTER
  private readonly cartItemName     = '[data-testid="cart-item-name"]';         // 👉 ADAPTER
  private readonly cartItemPrice    = '[data-testid="cart-item-price"]';        // 👉 ADAPTER
  private readonly cartItemQty      = '[data-testid="cart-item-quantity"]';     // 👉 ADAPTER (input ou affichage)
  private readonly increaseQtyBtn   = '[data-testid="qty-increase"]';           // 👉 ADAPTER (bouton +)
  private readonly decreaseQtyBtn   = '[data-testid="qty-decrease"]';           // 👉 ADAPTER (bouton -)
  private readonly removeItemBtn    = '[data-testid="remove-item"]';            // 👉 ADAPTER
  private readonly subtotal         = '[data-testid="cart-subtotal"]';          // 👉 ADAPTER
  private readonly emptyCartMessage = '[data-testid="empty-cart"]';             // 👉 ADAPTER
  private readonly checkoutBtn      = '[data-testid="checkout-btn"]';           // 👉 ADAPTER

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/cart');
    await this.waitForLoad();
  }

  // =========================================================
  // VÉRIFICATION DU CONTENU
  // =========================================================

  async verifyCartHasItems(): Promise<void> {
    await expect(this.page.locator(this.cartItem).first()).toBeVisible({ timeout: 5_000 });
  }

  async getItemCount(): Promise<number> {
    return await this.page.locator(this.cartItem).count();
  }

  /**
   * Vérifie que le panier contient un article avec le nom donné.
   */
  async verifyItemInCart(productName: string): Promise<void> {
    await expect(
      this.page.locator(this.cartItemName).filter({ hasText: productName })
    ).toBeVisible({ timeout: 5_000 });
  }

  async verifyFirstItemNameVisible(): Promise<void> {
    await expect(this.page.locator(this.cartItemName).first()).toBeVisible();
  }

  async verifyFirstItemPriceVisible(): Promise<void> {
    await expect(this.page.locator(this.cartItemPrice).first()).toBeVisible();
  }

  async verifyFirstItemQuantityVisible(): Promise<void> {
    // L'affichage peut être un <input> ou un <span>
    const qty = this.page.locator(this.cartItemQty)
      .or(this.page.locator(`${this.cartItem} input[type="number"]`));
    await expect(qty.first()).toBeVisible();
  }

  // =========================================================
  // MODIFICATION DE QUANTITÉ
  // =========================================================

  /**
   * Augmente la quantité du premier article via le bouton "+".
   */
  async increaseFirstItemQuantity(): Promise<void> {
    const btn = this.page.locator(this.increaseQtyBtn)
      .or(this.page.getByRole('button', { name: /^\+$|increase|augmenter/i }));
    await btn.first().click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Diminue la quantité du premier article via le bouton "-".
   */
  async decreaseFirstItemQuantity(): Promise<void> {
    const btn = this.page.locator(this.decreaseQtyBtn)
      .or(this.page.getByRole('button', { name: /^-$|decrease|diminuer/i }));
    await btn.first().click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Définit la quantité du premier article via un input direct.
   * Alternative au clic sur + / -.
   */
  async setFirstItemQuantity(quantity: number): Promise<void> {
    const input = this.page.locator(`${this.cartItem} input[type="number"]`).first();
    if (await input.isVisible()) {
      await input.fill(String(quantity));
      await input.press('Enter');
      await this.page.waitForTimeout(500);
    } else {
      // Si pas d'input direct, utiliser les boutons + plusieurs fois
      const current = await this.getFirstItemQuantityValue();
      const diff = quantity - current;
      for (let i = 0; i < Math.abs(diff); i++) {
        if (diff > 0) await this.increaseFirstItemQuantity();
        else await this.decreaseFirstItemQuantity();
      }
    }
  }

  async getFirstItemQuantityValue(): Promise<number> {
    const input = this.page.locator(`${this.cartItem} input[type="number"]`).first();
    if (await input.isVisible()) {
      return parseInt(await input.inputValue(), 10);
    }
    const text = await this.page.locator(this.cartItemQty).first().innerText();
    return parseInt(text, 10) || 1;
  }

  // =========================================================
  // SUPPRESSION
  // =========================================================

  async removeFirstItem(): Promise<void> {
    const btn = this.page.locator(this.removeItemBtn)
      .or(this.page.getByRole('button', { name: /supprimer|remove|delete|×/i }));
    await btn.first().click();
    await this.page.waitForTimeout(800);
  }

  async verifyCartIsEmpty(): Promise<void> {
    // 👉 ADAPTER : texte du message "panier vide"
    const emptyMsg = this.page.locator(this.emptyCartMessage)
      .or(this.page.getByText(/panier est vide|cart is empty|votre panier est vide/i));
    await expect(emptyMsg).toBeVisible({ timeout: 5_000 });
  }

  // =========================================================
  // SOUS-TOTAL
  // =========================================================

  /**
   * Retourne la valeur du sous-total sous forme de nombre.
   */
  async getSubtotalValue(): Promise<number> {
    const el = this.page.locator(this.subtotal)
      .or(this.page.getByText(/sous-total|subtotal/i).locator('..'));
    const text = await el.innerText();
    const cleaned = text.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleaned);
  }

  async verifySubtotalIsVisible(): Promise<void> {
    await expect(this.page.locator(this.subtotal)).toBeVisible(); // 👉 ADAPTER
  }

  /**
   * Vérifie que le sous-total correspond à prix × quantité.
   */
  async verifySubtotalCorrect(unitPrice: number, quantity: number): Promise<void> {
    const expected = parseFloat((unitPrice * quantity).toFixed(2));
    const actual = await this.getSubtotalValue();
    // Tolérance de 0.01 pour les arrondis
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(0.01);
  }

  // =========================================================
  // CHECKOUT
  // =========================================================

  async clickCheckout(): Promise<void> {
    const btn = this.page.locator(this.checkoutBtn)
      .or(this.page.getByRole('link', { name: /commander|checkout|passer commande/i }))
      .or(this.page.getByRole('button', { name: /commander|checkout|passer commande/i }));
    await btn.click();
    await this.page.waitForLoadState('load');
  }
}
