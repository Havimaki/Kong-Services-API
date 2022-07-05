import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../logger/logger.module';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { VersionModule } from '../version/version.module';
import { Service } from '../service/entity/service.entity';
import { Version } from '../version/entity/version.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      Version,
    ]),
    VersionModule,
    LoggerModule,
  ],
  controllers: [ServiceController],
  providers: [ServiceService]
})
export class ServiceModule { }
