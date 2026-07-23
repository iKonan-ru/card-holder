import type { IBankCard } from '@entities/bank-card';
import { decryptWithIv, encryptWithIv } from './aes-gcm';

export interface IStoredEncryptedCard {
  id: string;
  order: number;
  encryptedPayload: string;
}

export interface IStoredEncryptedRecord {
  id: string;
  encryptedPayload: string;
}

const encryptFields = async <T, TPlainKey extends keyof T>(
  record: T,
  plainKeys: readonly TPlainKey[],
  key: CryptoKey,
): Promise<Pick<T, TPlainKey> & { encryptedPayload: string }> => {
  const rest = { ...record } as Record<string, unknown>;
  const plain = {} as Pick<T, TPlainKey>;

  plainKeys.forEach((plainKey) => {
    plain[plainKey] = record[plainKey];
    delete rest[plainKey as string];
  });

  const encryptedPayload = await encryptWithIv(JSON.stringify(rest), key);

  return { ...plain, encryptedPayload };
};

const decryptFields = async <
  T,
  TStored extends { encryptedPayload: string },
  TPlainKey extends keyof TStored,
>(
  storedRecord: TStored,
  plainKeys: readonly TPlainKey[],
  key: CryptoKey,
): Promise<T> => {
  const decryptedJson = await decryptWithIv(storedRecord.encryptedPayload, key);
  const rest: Omit<T, TPlainKey> = JSON.parse(decryptedJson);
  const plain = {} as Pick<TStored, TPlainKey>;

  plainKeys.forEach((plainKey) => {
    plain[plainKey] = storedRecord[plainKey];
  });

  return { ...plain, ...rest } as T;
};

const CARD_PLAIN_KEYS = ['id', 'order'] as const;

export const encryptCardFields = async (
  card: IBankCard,
  key: CryptoKey,
): Promise<IStoredEncryptedCard> => {
  return encryptFields(card, CARD_PLAIN_KEYS, key);
};

export const decryptCardFields = async (
  record: IStoredEncryptedCard,
  key: CryptoKey,
): Promise<IBankCard> => {
  return decryptFields<IBankCard, IStoredEncryptedCard, 'id' | 'order'>(
    record,
    CARD_PLAIN_KEYS,
    key,
  );
};

const RECORD_PLAIN_KEYS = ['id'] as const;

export const encryptRecordFields = async <T extends { id: string }>(
  record: T,
  key: CryptoKey,
): Promise<IStoredEncryptedRecord> => {
  return encryptFields(record, RECORD_PLAIN_KEYS, key);
};

export const decryptRecordFields = async <T extends { id: string }>(
  record: IStoredEncryptedRecord,
  key: CryptoKey,
): Promise<T> => {
  return decryptFields<T, IStoredEncryptedRecord, 'id'>(
    record,
    RECORD_PLAIN_KEYS,
    key,
  );
};
