import axios from "axios";
import { IBitcoinService } from "../bitcoin-service.factory";

const COINBASE_URL = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUAH";

export class BinanceService implements IBitcoinService {
  public async getBitcoinPrice(): Promise<number> {
    const result = await axios.get(COINBASE_URL);
    return Number(result?.data?.price);
  }
}
