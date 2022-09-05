import MockSES from 'aws-sdk/clients/ses';
import { EmailSenderService } from '../src/services/email-sender.service';

jest.mock('aws-sdk/clients/ses', () => {
  const mSES = {
    sendEmail: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return jest.fn(() => mSES);
});

const mSes = new MockSES();
const emailSenderService = new EmailSenderService();
const validEmailAddresses = ['test@test.com', 'yo@yo.com'];
const bitcoinRate = Math.random() * (100000 - 15) + 15;

describe('Test email sending', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('SES sendEmails method was called as expected', async () => {
    (mSes as any).sendEmail().promise.mockResolvedValue();
  
    const result = await emailSenderService.sendEmails(validEmailAddresses, bitcoinRate);

    expect(mSes.sendEmail().promise).toBeCalledTimes(1);
    expect(MockSES).toBeCalledWith({ apiVersion: '2010-12-01' });
    expect(result.failedEmails).toEqual([]);
    expect(result.error).toBeUndefined;
  }),

  test('In case of SES error, SES fails the batch completely', async () => {
    const mError = new Error('This is a SES error');
    (mSes as any).sendEmail().promise.mockRejectedValueOnce(mError);

    const result = await emailSenderService.sendEmails(validEmailAddresses, bitcoinRate);

    expect(MockSES).toBeCalledWith({ apiVersion: '2010-12-01' });
    expect(mSes.sendEmail().promise).toBeCalledTimes(1);
    expect(result.failedEmails).toEqual(validEmailAddresses);
    expect(result.error).toBeDefined;
  });

  test('Emails should be sent only to the valid addresses', async () => {
    (mSes as any).sendEmail().promise.mockResolvedValue();
    const emailAddresses = ['test@test', 'yo@yo!com', 'valid@test.com'];

    const result = await emailSenderService.sendEmails(emailAddresses, bitcoinRate);
    expect(mSes.sendEmail().promise).toBeCalledTimes(1);
    expect(MockSES).toBeCalledWith({ apiVersion: '2010-12-01' });
    expect(result.error).toBeUndefined;
    expect(result.failedEmails).toEqual(['test@test', 'yo@yo!com']);
  });
});