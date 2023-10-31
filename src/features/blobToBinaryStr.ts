export const blobToBinaryStr = (blob) =>
  new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsBinaryString(blob);
  });
