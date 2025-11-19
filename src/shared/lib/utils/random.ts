import { HEX_RADIX, BYTE_ITERATION_START } from '../constants';

const RANDOM_ID_LENGTH = 8;

export const generateRandomId = (): string => {
  const buffer = new Uint8Array(RANDOM_ID_LENGTH);
  crypto.getRandomValues(buffer);

  let randomId = '';

  for (let index = BYTE_ITERATION_START; index < buffer.length; index++) {
    const byte = buffer[index];
    randomId += byte.toString(HEX_RADIX).padStart(2, '0');
  }

  return randomId;
};
