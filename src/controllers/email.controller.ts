import * as express from "express";
import { CoinbaseService } from "../services/providers/coinbase.service";
import { BroadcastService, IBroadcastService } from "../services/broadcast.service";
import { EmailRepository, IEmailRepository } from "../repositories/email-repository";
import { EmailSenderService, IEmailSenderService } from "../services/email-sender.service";
import { CoinGeckoService } from "../services/providers/coingecko.service";
import { IBitcoinService } from "../services/bitcoin-service.factory";
import { BinanceService } from "../services/providers/binance.service";
import { IProviderChainService, ProviderChainService } from "../services/provider-chain.service";
import { CacheService, ICacheService } from "../services/cache.service";

export class EmailController {
  public router = express.Router();

  private _emailRepoService: IEmailRepository;
  private _bitcoinService: IProviderChainService;
  private _emailSenderService: IEmailSenderService;
  private _broadcastService: IBroadcastService;
  private _cacheService: ICacheService;

  constructor() {
    this._emailRepoService = new EmailRepository();
    this._emailSenderService = new EmailSenderService();
    this._cacheService = new CacheService();
    this._bitcoinService = new ProviderChainService(this._cacheService);
    
    this._broadcastService = new BroadcastService(
      this._emailRepoService,
      this._emailSenderService,
      this._bitcoinService,
    );
    this._initRoutes();
  }

  private async _initRoutes() {
    this.router.get("/rate", this._rate.bind(this));
    this.router.post("/subscribe", this._subscribe.bind(this));
    this.router.post("/sendEmails", this._sendEmails.bind(this));
  }

  private _subscribe(req: express.Request, res: express.Response) {
    if (!req.body.email) {
      res.status(400).json({ error: "Request should contain email field" });
      return;
    }
    if (this._emailRepoService.saveEmail(req.body.email)) {
      res.status(200).end();
      return;
    }
    res.status(409).json({ error: "Email already exists" });
  }

  private async _rate(req: express.Request, res: express.Response) {
    try {
      const result = await this._bitcoinService.getBitcoinPrice();
      if (result === undefined) {
        res.status(500).json({ error: "Rate service returned unexpected response" });
        return;
      }
      res.status(200).send(result.toString());
    } catch (error) {
      res.status(error.response.status).json({ error: `Error: ${error.response.statusText}` });
    }
  }

  private async _sendEmails(req: express.Request, res: express.Response) {
    try {
      const result = await this._broadcastService.broadcastBitcoinRate();
      if (result.error) {
        res.status(500).json({ error: `Error: ${result.error}` });
      } else {
        res.status(200).send({ message: "Emails successfully sent", failedEmails: result.failedEmails });
      }
    } catch (error) {
      res.status(error.statusCode).json({ error: `Error: ${error.text}` });
    }
  }
}
