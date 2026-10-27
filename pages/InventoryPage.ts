import { Locator, Page } from "@playwright/test";
import { CartPage } from "./CartPage";

export type InventoryProduct = {
  name: string;
  price: string;
};

export class InventoryPage {
  private readonly page: Page;

  // Locators
  private readonly inventoryItems: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.inventoryItems = page.locator(".inventory_item");
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  /**
   * Returns each product shown on the inventory page.
   * @returns Promise<InventoryProduct[]> - visible product names and prices
   */
  async getProducts(): Promise<InventoryProduct[]> {
    const products: InventoryProduct[] = [];
    await this.inventoryItems.first().waitFor({ state: "visible" });

    for (
      let index = 0;
      index < (await this.inventoryItems.count());
      index += 1
    ) {
      const item = this.inventoryItems.nth(index);
      products.push({
        name: await item
          .locator('[data-test="inventory-item-name"]')
          .innerText(),
        price: await item
          .locator('[data-test="inventory-item-price"]')
          .innerText(),
      });
    }

    return products;
  }

  /**
   * Adds a product to the cart.
   * @param productName - Exact name of the product to add
   */
  async addProductToCart(productName: string): Promise<void> {
    await this.getInventoryItem(productName)
      .getByRole("button", { name: "Add to cart" })
      .click();
  }

  /**
   * Checks whether a product's inventory button now offers removal.
   * @param productName - Exact name of the product to check
   * @returns Promise<boolean> - true when its Remove button is visible
   */
  async isProductAdded(productName: string): Promise<boolean> {
    return this.getInventoryItem(productName)
      .getByRole("button", { name: "Remove" })
      .isVisible();
  }

  /**
   * Opens the shopping cart.
   * @returns Promise<CartPage> - the cart page object
   */
  async openCart(): Promise<CartPage> {
    await this.cartLink.click();
    await this.page.waitForURL("**/cart.html");
    return new CartPage(this.page);
  }

  private getInventoryItem(productName: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.getByRole("button", {
        name: `View details for ${productName}`,
      }),
    });
  }
}
