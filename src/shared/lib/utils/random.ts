import { INITIAL_ZERO } from '../constants';

const RANDOM_ID_LENGTH = 8;
const HEX_RADIX = 16;
const BYTE_ITERATION_START = INITIAL_ZERO;

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
