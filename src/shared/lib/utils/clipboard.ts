import { ERROR_FAILED_TO_COPY } from '../constants';

const copyWithExecCommand = (text: string): boolean => {
  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.top = `0px`;
  textarea.style.left = `0px`;
  textarea.style.width = '2em';
  textarea.style.height = '2em';
  textarea.style.padding = '0';
  textarea.style.border = 'none';
  textarea.style.outline = 'none';
  textarea.style.boxShadow = 'none';
  textarea.style.background = 'transparent';
  textarea.setAttribute('readonly', '');

  document.body.appendChild(textarea);

  const isIOS = /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase());

  if (isIOS) {
    const range = document.createRange();
    range.selectNodeContents(textarea);

    const selection = window.getSelection();

    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    textarea.setSelectionRange(0, textarea.value.length);
  } else {
    textarea.select();
  }

  let success = false;

  try {
    success = document.execCommand('copy');
  } catch {
    success = false;
  }

  document.body.removeChild(textarea);

  return success;
};

const checkIsClipboardAPIAvailable = (): boolean => {
  const hasNavigatorClipboard = Boolean(navigator.clipboard);
  const hasWriteText = Boolean(navigator.clipboard?.writeText);

  return hasNavigatorClipboard && hasWriteText;
};

export const copyToClipboard = async (text: string): Promise<void> => {
  const isClipboardAvailable = checkIsClipboardAPIAvailable();

  if (isClipboardAvailable) {
    try {
      await navigator.clipboard.writeText(text);

      return;
    } catch {
      const fallbackSuccess = copyWithExecCommand(text);

      if (!fallbackSuccess) {
        throw new Error(ERROR_FAILED_TO_COPY);
      }

      return;
    }
  }

  const fallbackSuccess = copyWithExecCommand(text);

  if (!fallbackSuccess) {
    throw new Error(ERROR_FAILED_TO_COPY);
  }
};
