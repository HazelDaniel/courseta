export const wait: (seconds: number) => Promise<boolean> = (seconds) => {
  return new Promise((res, rej) => {
    try {
      setTimeout(() => {
        res(true);
      }, seconds * 1000);
    } catch (err) {
      rej(false);
    }
  });
}