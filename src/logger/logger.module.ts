import { Module } from '@nestjs/common';
import { LoggerInstance } from './logger.service';

@Module({
  providers: [LoggerInstance],
  exports: [LoggerInstance],
})
export class LoggerModule { }