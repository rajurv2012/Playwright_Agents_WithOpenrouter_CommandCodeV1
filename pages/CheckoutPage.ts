import { Locator, Page } from "@playwright/test";
import { ConfirmationPage } from "./ConfirmationPage";

export type CartProduct = {
  name: string;
  price: string;
  quantity: string;
};

export type PriceSummary = {
  itemTotal: string;
  tax: string;
  total: string;
};

export class CheckoutPage {
  private readonly page: Page;

  // Locators
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly cartItems: Locator;
  private readonly itemTotal: Locator;
  private readonly tax: Locator;
  private readonly total: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.firstNameInput = page.getByRole("textbox", { name: "First Name" });
    this.lastNameInput = page.getByRole("textbox", { name: "Last Name" });
    this.postalCodeInput = page.getByRole("textbox", {
      name: "Zip/Postal Code",
    });
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.finishButton = page.getByRole("button", { name: "Finish" });
    this.cartItems = page.locator(".cart_item");
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
  }

  /**
   * Fills and submits the checkout information form.
   * @param firstName - customer first name
   * @param lastName - customer last name
   * @param postalCode - customer postal code
   */
  async continueWithInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
    await this.page.waitForURL("**/checkout-step-two.html");
  }

  /**
   * Returns the products shown in the order overview.
   * @returns Promise<CartProduct[]> - overview product details
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
   * Returns the item subtotal, tax, and final total shown in the overview.
   * @returns Promise<PriceSummary> - visible price summary text
   */
  async getPriceSummary(): Promise<PriceSummary> {
    return {
      itemTotal: await this.itemTotal.innerText(),
      tax: await this.tax.innerText(),
      total: await this.total.innerText(),
    };
  }

  /**
   * Completes the order.
   * @returns Promise<ConfirmationPage> - the order confirmation page object
   */
  async finish(): Promise<ConfirmationPage> {
    await this.finishButton.click();
    await this.page.waitForURL("**/checkout-complete.html");
    return new ConfirmationPage(this.page);
  }
}
