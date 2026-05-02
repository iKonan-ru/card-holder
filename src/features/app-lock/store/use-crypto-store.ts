import { create } from 'zustand';
import {
  deriveKeyFromPassword,
  ERROR_WRONG_MASTER_PASSWORD,
  loadOrCreateSalt,
  MASTER_KEY_SALT_STORAGE_KEY,
  saveVerificationToken,
  verifyMasterPassword,
  withRateLimit,
} from '@shared/lib';

interface ICryptoStore {
  cryptoKey: CryptoKey | null;
  isUnlocked: boolean;
  isFirstSetup: boolean;
  unlock(password: string): Promise<void>;
  lock(): void;
}

export const useCryptoStore = create<ICryptoStore>((set) => ({
  cryptoKey: null,
  isUnlocked: false,
  isFirstSetup: !localStorage.getItem(MASTER_KEY_SALT_STORAGE_KEY),

  unlock: async (password: string) => {
    const { salt, isNew } = loadOrCreateSalt();
    const key = await deriveKeyFromPassword(password, salt);

    if (isNew) {
      await saveVerificationToken(key);
      set({ cryptoKey: key, isUnlocked: true, isFirstSetup: false });
    } else {
      await withRateLimit(async () => {
        const isValid = await verifyMasterPassword(password);

        if (!isValid) {
          throw new Error(ERROR_WRONG_MASTER_PASSWORD);
        }
      });

      set({ cryptoKey: key, isUnlocked: true });
    }
  },

  lock: () => {
    set({ cryptoKey: null, isUnlocked: false });
  },
}));
