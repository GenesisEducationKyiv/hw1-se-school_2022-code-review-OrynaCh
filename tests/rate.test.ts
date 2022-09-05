import { BitcoinService } from "../src/services/bitcoin.service";

describe('Test integration with external Coinbase API', () => {
  test('Bitcoin rate is a relevant number', async () => {
    const bitcoinService = new BitcoinService()
    const result = await bitcoinService.getBitcoinPrice();
    expect(result).not.toBeNull();
    expect(result).toBeDefined();
    expect(result).toBeGreaterThan(0);
  });
});
