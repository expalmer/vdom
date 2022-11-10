export const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });

export const arrayFromMax = (a = 0, b = 0) => {
  const max = Math.max(a, b);

  return Array(max)
    .fill(0)
    .map((_, index) => index);
};
