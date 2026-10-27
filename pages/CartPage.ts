import { Locator, Page } from "@playwright/test";
import { CheckoutPage, CartProduct } from "./CheckoutPage";

export class CartPage {
  private readonly page: Page;

  // Locators
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
  }

  /**
   * Returns the products and quantities currently in the cart.
   * @returns Promise<CartProduct[]> - cart product details
   */
  async getProducts(): Promise<CartProduct[]> {
    const products: CartProduct[] = [];
    await this.cartItems.first().waitFor({ state: "visible" });

    for (let index = 0; index < (await this.cartItems.count()); index += 1) {
      const item = this.cartItems.nth(index);
      products.push({
        name: await item
          .locator('[data-test="inventory-item-name"]')
          .innerText(),
        price: await item
          .locator('[data-test="inventory-item-price"]')
          .innerText(),
        quantity: await item.locator('[data-test="item-quantity"]').innerText(),
      });
    }

    return products;
  }

  /**
   * Proceeds from the cart to checkout information.
   * @returns Promise<CheckoutPage> - the checkout page object
   */
  async checkout(): Promise<CheckoutPage> {
    await this.checkoutButton.click();
    await this.page.waitForURL("**/checkout-step-one.html");
    return new CheckoutPage(this.page);
  }
}
