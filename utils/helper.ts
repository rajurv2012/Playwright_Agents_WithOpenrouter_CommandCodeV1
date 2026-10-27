/**
 * Helper utility class for common test operations
 */

export class Helper {
  /**
   * Convert price string to number by removing all non-digit and non-decimal characters
   */
  static convertPriceToNumber(price: string): number {
    const cleaned = price.replace(/[^\d.]/g, '');
    return parseFloat(cleaned);
  }

  /**
   * Get fixed product details for testing
   */
  static getProductDetails() {
    return {
      productName: 'MacBook',
      productQuantity: '1',
      totalPrice: '$602.00',
    };
  }

  /**
   * Get fixed login credentials for testing
   */
  static getLoginDetails() {
    return {
      email: 'pavanol@xyz.com',
      password: 'test@123',
    };
  }
}