import { Locator, Page } from "@playwright/test";

export class ConfirmationPage {
  // Locators
  private readonly thankYouHeading: Locator;
  private readonly dispatchMessage: Locator;

  constructor(page: Page) {
    // Initialize locators with CSS selectors
    this.thankYouHeading = page.getByRole("heading", {
      name: "Thank you for your order!",
    });
    this.dispatchMessage = page.getByText(
      "Your order has been dispatched, and will arrive just as fast as the pony can get there!",
      { exact: true },
    );
  }

  /**
   * Returns the order confirmation heading.
   * @returns Promise<string> - heading text
   */
  async getThankYouHeading(): Promise<string> {
    return this.thankYouHeading.innerText();
  }

  /**
   * Returns the order dispatch message.
   * @returns Promise<string> - dispatch message text
   */
  async getDispatchMessage(): Promise<string> {
    return this.dispatchMessage.innerText();
  }
}
