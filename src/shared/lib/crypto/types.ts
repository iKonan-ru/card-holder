export interface IEncryptedPayload {
  version: number;
  timestamp: number;
  salt: string;
  iv: string;
  encrypted: string;
}
