import { IEmailRepository } from "../repositories/email-repository";
import { IEmailDispatchResult, IEmailSenderService } from "../services/email-sender.service";
import { IBitcoinService } from "./bitcoin-service.factory";

export class BroadcastService implements IBroadcastService {
  private _emailRepoService: IEmailRepository;
  private _bitcoinService: IBitcoinService;
  private _emailSenderService: IEmailSenderService;

  constructor(
    emailRepoService: IEmailRepository,
    emailSenderService: IEmailSenderService,
    bitcoinService: IBitcoinService,
  ) {
    this._emailRepoService = emailRepoService;
    this._emailSenderService = emailSenderService;
    this._bitcoinService = bitcoinService;
  }

  public async broadcastBitcoinRate(): Promise<IEmailDispatchResult> {
    const currentBitcoinRate = await this._bitcoinService.getBitcoinPrice();
    const emails = this._emailRepoService.getAll();
    const result = await this._emailSenderService.sendEmails(emails, currentBitcoinRate);
    return result;
  }
}

export interface IBroadcastService {
  broadcastBitcoinRate(): Promise<IEmailDispatchResult>;
}
