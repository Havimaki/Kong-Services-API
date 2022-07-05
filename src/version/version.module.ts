import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../logger/logger.module';
import { Version } from './entity/version.entity';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Version,
    ]),
    LoggerModule,
  ],
  controllers: [VersionController],
  providers: [VersionService],
  exports: [VersionService],
})
export class VersionModule { }
