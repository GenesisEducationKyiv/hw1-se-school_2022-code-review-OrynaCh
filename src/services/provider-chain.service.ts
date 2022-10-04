import { config } from "../config";
import { BitcoinServiceFactory, IBitcoinServiceFactory } from "./bitcoin-service.factory";
import { ICacheService } from "./cache.service";

export interface IProviderChainService {
  getBitcoinPrice(): Promise<number>;
}

export interface ICachedRate {
  currency: string;
  date: Date;
  rate: number;
}

export class ProviderChainService implements IProviderChainService {
  private _bitcoinServiceFactory: IBitcoinServiceFactory;
  private _cacheService: ICacheService;

  constructor(cacheService: ICacheService) {
    this._bitcoinServiceFactory = new BitcoinServiceFactory();
    this._cacheService = cacheService;
  }

  public async getBitcoinPrice(): Promise<number> {
    const cachedRate = this._cacheService.getCachedRate()?.rate;
    if (cachedRate) {
      return cachedRate;
    }
    for (const [index, providerName] of config.providerChain.entries()) {
      try {
        const service = this._bitcoinServiceFactory.getOrCreateBitcoinService(providerName);
        const bitcoinPrice = await service.getBitcoinPrice();
        this._cacheService.saveRateToCache(bitcoinPrice);
        return bitcoinPrice;
      } catch (error) {
        if (index < (config.providerChain.length - 1)) { continue; }
        throw error;
      }
    }
  }
}
