import { CoinbaseService } from "../src/services/providers/coinbase.service";

describe('Test integration with external Coinbase API', () => {
  test('Bitcoin rate is a relevant number', async () => {
    const coinbaseService = new CoinbaseService();
    const result = await coinbaseService.getBitcoinPrice();
    expect(result).not.toBeNull();
    expect(result).toBeDefined();
    // TODO update tests
    expect(result).toBeGreaterThan(0);
  });
});
