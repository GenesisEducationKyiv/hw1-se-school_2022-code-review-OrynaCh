
import { config } from "../config";
import { ICachedRate } from "./provider-chain.service";

export interface ICacheService {
  getCachedRate(): ICachedRate,
  saveRateToCache(rateAmount: number): void, 
}

export class CacheService implements ICacheService {
  public cachedRate: ICachedRate;

  public getCachedRate(): ICachedRate {
    if (!this.cachedRate?.date) return null;
    if (this._isCacheValidate(config.cacheExpirationTime ?? 300000)) {
      this.cachedRate = null;
      return null;
    } 
    return this.cachedRate;
  }

  public saveRateToCache(rateAmount: number): void {
    this.cachedRate = {
      currency: 'UAH',
      date: new Date().toISOString(),
      rate: rateAmount,
    }
  }

  private _isCacheValidate(cacheExpirationTime: number): boolean {
    const now = new Date();
    const dateCached = new Date(this.cachedRate?.date);
    const utc1 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const utc2 = Date.UTC(dateCached.getFullYear(), dateCached.getMonth(), dateCached.getDate());
    return ((utc1 - utc2) < cacheExpirationTime) ? false : true;
  }
}