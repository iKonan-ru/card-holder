export const downloadFile = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);

  try {
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  } finally {
    URL.revokeObjectURL(url);
  }
};
