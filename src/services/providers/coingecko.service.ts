import axios from "axios";
import { IBitcoinService } from "../bitcoin-service.factory";

const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=uah";

export class CoinGeckoService implements IBitcoinService {
  public async getBitcoinPrice(): Promise<number> {
    const result = await axios.get(COINGECKO_URL);
    return Number(result?.data?.bitcoin?.uah);
  }
}
