import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly sortSelect: Locator;
  readonly products: Locator;
  readonly productNames: Locator;
  readonly productDescriptions: Locator;
  readonly productPrices: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutButton: Locator;
  readonly resetAppStateButton: Locator;
  readonly closeMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.products = page.getByTestId('inventory-item');
    this.productNames = page.getByTestId('inventory-item-name');
    this.productDescriptions = page.getByTestId('inventory-item-desc');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.resetAppStateButton = page.getByRole('button', { name: 'Reset App State' });
    this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
  }

  productByName(name: string): Locator {
    return this.products.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  async getProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  async getProductPrices(): Promise<string[]> {
    return this.productPrices.allTextContents();
  }

  async getProductCount(): Promise<number> {
    return this.products.count();
  }

  async selectSortOrder(value: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortSelect.selectOption(value);
  }

  async openProductByName(name: string): Promise<void> {
    await this.page.getByText(name, { exact: true }).click();
  }

  productActionButton(name: string): Locator {
    return this.productByName(name).locator('button');
  }

  productImage(name: string): Locator {
    return this.productByName(name).getByRole('img');
  }

  async addProductByName(name: string): Promise<void> {
    await this.productByName(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProductByName(name: string): Promise<void> {
    await this.productByName(name).getByRole('button', { name: 'Remove' }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
    await this.logoutButton.waitFor({ state: 'visible' });
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutButton.click();
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.resetAppStateButton.click();
  }

  async closeMenu(): Promise<void> {
    await this.closeMenuButton.click();
  }
}
