import { LoggerService } from '@nestjs/common';

const Log = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  crimson: "\x1b[38m"
};

export class LoggerInstance implements LoggerService {
  log(func: string, message: string) {
    console.log(Log.yellow, `[${func}]:`, Log.green, message);
  }

  error(func: string, message: string) {
    console.error(Log.yellow, `[${func}]:`, Log.red, message);
  }

  warn(func: string, message: string) {
    console.warn(Log.yellow, message)
    console.warn(Log.yellow, `[${func}]:`, Log.yellow, message);
  }
}