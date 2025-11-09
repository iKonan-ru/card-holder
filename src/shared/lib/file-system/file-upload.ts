import { createFileSelectionCancelledError } from './errors';

export const uploadFile = (accept: string): Promise<File> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';

    input.onchange = () => {
      const file = input.files?.[0];

      if (file) {
        resolve(file);
      } else {
        reject(createFileSelectionCancelledError());
      }

      document.body.removeChild(input);
    };

    input.oncancel = () => {
      reject(createFileSelectionCancelledError());
      document.body.removeChild(input);
    };

    document.body.appendChild(input);
    input.click();
  });
};
