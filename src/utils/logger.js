export const logger = {
  info: (...args) => console.error('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  debug: (...args) => console.error('[DEBUG]', ...args)
};
