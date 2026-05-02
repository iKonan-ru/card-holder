import { create } from 'zustand';
import {
  deriveKeyFromPassword,
  loadOrCreateSalt,
  MASTER_KEY_SALT_STORAGE_KEY,
  saveVerificationToken,
  verifyMasterPassword,
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
      const isValid = await verifyMasterPassword(password);

      if (!isValid) {
        throw new Error('Wrong password');
      }

      set({ cryptoKey: key, isUnlocked: true });
    }
  },

  lock: () => {
    set({ cryptoKey: null, isUnlocked: false });
  },
}));
