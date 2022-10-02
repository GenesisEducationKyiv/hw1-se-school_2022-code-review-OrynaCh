import axios from "axios";
import { IBitcoinService } from "../bitcoin-service.factory";

const COINBASE_URL = "https://api.coinbase.com/v2/prices/BTC-UAH/buy";

export class CoinbaseService implements IBitcoinService {
  public async getBitcoinPrice(): Promise<number> {
    const result = await axios.get(COINBASE_URL);
    return Number(result?.data?.data?.amount);
  }
}
