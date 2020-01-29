export const randomPort = (): string => {
  const port = Math.floor(Math.random() * (2 ** 16 - 1024 + 1)) + 1024;
  return port.toString();
};
