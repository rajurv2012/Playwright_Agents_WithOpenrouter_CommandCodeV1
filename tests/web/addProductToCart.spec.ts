/**
 * Test Case: Add two products to the cart and complete checkout
 *
 * Tags: @master @sanity @regression @web @end-to-end
 *
 * Steps:
 * 1) Log in to SauceDemo
 * 2) Add two randomly selected products and verify their buttons change to Remove
 * 3) Verify cart products and complete checkout
 * 4) Verify the item subtotal and final total
 * 5) Verify the order confirmation
 */

import { test, expect } from "../../fixtures/pageFixtures";
import { InventoryProduct } from "../../pages/InventoryPage";
import { Helper } from "../../utils/helper";
import { sauceDemoData } from "../../testdata/sauceDemoData";

function selectRandomProducts(
  products: InventoryProduct[],
  count: number,
): InventoryProduct[] {
  const shuffled = [...products];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, count);
}

function priceInCents(price: string): number {
  return Math.round(Helper.convertPriceToNumber(price) * 100);
}

test("Add two products to cart and complete checkout @master @sanity @regression @web @end-to-end", async ({
  loginPage,
  inventoryPage,
  cartPage,
  checkoutPage,
  confirmationPage,
}) => {
  const { username, password } = sauceDemoData.getLoginDetails();
  const checkoutInformation = sauceDemoData.checkoutInformation;
  let selectedProducts: InventoryProduct[] = [];

  await test.step("1) Log in to SauceDemo", async () => {
    await loginPage.login(username, password);
    expect(await inventoryPage.getProducts()).not.toHaveLength(0);
  });

  await test.step("2) Add two random products and verify the buttons change to Remove", async () => {
    selectedProducts = selectRandomProducts(
      await inventoryPage.getProducts(),
      2,
    );

    for (const product of selectedProducts) {
      await inventoryPage.addProductToCart(product.name);
      expect(await inventoryPage.isProductAdded(product.name)).toBeTruthy();
    }
  });

  await test.step("3) Verify the cart contains the selected products and checkout", async () => {
    await inventoryPage.openCart();
    const cartProducts = await cartPage.getProducts();

    expect(cartProducts).toHaveLength(2);
    expect(cartProducts).toEqual(
      expect.arrayContaining(
        selectedProducts.map((product) => ({
          ...product,
          quantity: "1",
        })),
      ),
    );

    await cartPage.checkout();
  });

  await test.step("4) Enter customer information and review the order", async () => {
    await checkoutPage.continueWithInformation(
      checkoutInformation.firstName,
      checkoutInformation.lastName,
      checkoutInformation.postalCode,
    );

    const overviewProducts = await checkoutPage.getProducts();
    expect(overviewProducts).toHaveLength(2);
    expect(overviewProducts).toEqual(
      expect.arrayContaining(
        selectedProducts.map((product) => ({
          ...product,
          quantity: "1",
        })),
      ),
    );

    const expectedItemTotalCents = selectedProducts.reduce(
      (sum, product) => sum + priceInCents(product.price),
      0,
    );
    const expectedTaxCents = Math.round(expectedItemTotalCents * 0.08);
    const expectedTotalCents = expectedItemTotalCents + expectedTaxCents;
    const summary = await checkoutPage.getPriceSummary();

    expect(priceInCents(summary.itemTotal)).toBe(expectedItemTotalCents);
    expect(priceInCents(summary.tax)).toBe(expectedTaxCents);
    expect(priceInCents(summary.total)).toBe(expectedTotalCents);
  });

  await test.step("5) Finish the order and verify confirmation messages", async () => {
    await checkoutPage.finish();

    expect(await confirmationPage.getThankYouHeading()).toBe(
      "Thank you for your order!",
    );
    expect(await confirmationPage.getDispatchMessage()).toBe(
      "Your order has been dispatched, and will arrive just as fast as the pony can get there!",
    );
  });

  console.log(
    "✅ ✔️ Completed SauceDemo add-to-cart and checkout successfully!",
  );
});
