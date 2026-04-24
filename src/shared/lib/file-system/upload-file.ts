import { createFileSelectionCancelledError } from './errors';

export const uploadFile = (accept: string): Promise<File> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';

    const cleanup = () => {
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    };

    input.onchange = () => {
      const file = input.files?.[0];

      cleanup();

      if (file) {
        resolve(file);
      } else {
        reject(createFileSelectionCancelledError());
      }
    };

    input.oncancel = () => {
      cleanup();
      reject(createFileSelectionCancelledError());
    };

    document.body.appendChild(input);
    input.click();
  });
};
