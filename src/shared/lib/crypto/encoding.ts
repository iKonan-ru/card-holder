export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const length = bytes.length;

  for (let index = 0; index < length; index++) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary);
};

export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  return base64ToUint8Array(base64).buffer as ArrayBuffer;
};
