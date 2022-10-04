
import { config } from "../config";
import { ICachedRate } from "./provider-chain.service";

export interface ICacheService {
  getCachedRate(): ICachedRate;
  saveRateToCache(rateAmount: number): void;
}

export class CacheService implements ICacheService {
  public cachedRate: ICachedRate;

  public getCachedRate(): ICachedRate {
    if (!this.cachedRate?.date) { return null; }
    if (!this._isCacheValid(config.cacheExpirationTime ?? 300000)) {
      this.cachedRate = null;
      return null;
    }
    return this.cachedRate;
  }

  public saveRateToCache(rateAmount: number): void {
    this.cachedRate = {
      currency: "UAH",
      date: new Date(),
      rate: rateAmount,
    };
  }

  private _isCacheValid(cacheExpirationTime: number): boolean {
    const now = new Date().getTime();
    const dateCached = new Date(this.cachedRate?.date).getTime();
    return dateCached + cacheExpirationTime > now;
  }
}
