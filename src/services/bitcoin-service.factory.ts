import { config } from "../config";
import { BinanceService } from "./providers/binance.service";
import { CoinbaseService } from "./providers/coinbase.service";
import { CoinGeckoService } from "./providers/coingecko.service";

export interface IBitcoinServiceFactory {
  getOrCreateBitcoinService(providerName: string): IBitcoinService;
}

export interface IBitcoinService {
  getBitcoinPrice(): Promise<number>;
}

export class BitcoinServiceFactory implements IBitcoinServiceFactory {
  private _cachedService: { name: string; service: IBitcoinService };

  public getOrCreateBitcoinService(providerName: string): IBitcoinService {
    if (providerName === this._cachedService?.name) { return this._cachedService.service; }
    switch (providerName) {
      case config.providers.coinbase:
        const coinbaseService = new CoinbaseService();
        this._cachedService = { name: providerName, service: coinbaseService };
        return coinbaseService;
      case config.providers.coingecko:
        const coinGeckoService = new CoinGeckoService();
        this._cachedService = { name: providerName, service: coinGeckoService };
        return coinGeckoService;
      case config.providers.binance:
        const binanceService = new BinanceService();
        this._cachedService = { name: providerName, service: binanceService };
        return binanceService;
      default:
        const fallbackService = new CoinbaseService();
        this._cachedService = { name: providerName, service: fallbackService };
        return fallbackService;
    }
  }
}
