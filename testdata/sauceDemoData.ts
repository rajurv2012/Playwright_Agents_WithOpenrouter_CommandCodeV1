export type CheckoutInformation = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export const sauceDemoData = {
  getLoginDetails(): { username: string; password: string } {
    const { SAUCEDEMO_USERNAME, SAUCEDEMO_PASSWORD } = process.env;

    if (!SAUCEDEMO_USERNAME || !SAUCEDEMO_PASSWORD) {
      throw new Error(
        "SAUCEDEMO_USERNAME and SAUCEDEMO_PASSWORD must be set in the environment.",
      );
    }

    return {
      username: SAUCEDEMO_USERNAME,
      password: SAUCEDEMO_PASSWORD,
    };
  },
  checkoutInformation: {
    firstName: "ramesh",
    lastName: "raju",
    postalCode: "765001",
  } satisfies CheckoutInformation,
};
