import { BinanceService } from "./providers/binance.service";
import { CoinbaseService } from "./providers/coinbase.service";
import { CoinGeckoService } from "./providers/coingecko.service";

export interface IBitcoinServiceFactory {
  getOrCreateBitcoinService(serviceName: string): IBitcoinService;
}

export interface IBitcoinService {
  getBitcoinPrice(): Promise<number>;
}

// TODO move to consts
export const services = {
  coinbaseService: 'COINBASE',
  coinGeckoService: 'COINGECKO',
  binanceService: 'BINANCE',
}

export class BitcoinServiceFactory implements IBitcoinServiceFactory {
  private _cachedService: { name: string; service: IBitcoinService };

  public getOrCreateBitcoinService(serviceName: string): IBitcoinService { 
    if (serviceName === this._cachedService?.name) return this._cachedService.service;
    switch(serviceName) {
      case services.coinbaseService:
        const coinbaseService = new CoinbaseService();
        this._cachedService = { name: serviceName, service: coinbaseService };
        return coinbaseService;
      case services.coinGeckoService:
        const coinGeckoService = new CoinGeckoService();
        this._cachedService = { name: serviceName, service: coinGeckoService };
        return coinGeckoService;
      case services.binanceService:
        const binanceService = new BinanceService();
        this._cachedService = { name: serviceName, service: binanceService };
        return binanceService;
      default:
        const fallbackService = new CoinbaseService();
        this._cachedService = { name: serviceName, service: fallbackService };
        return fallbackService;
    }
  }
}