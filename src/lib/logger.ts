// 간단한 로거 유틸리티
export const logger = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },
  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.info(...args);
    }
  },
};

