
import {
  TypeOrmOptionsFactory,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: 'kong-db',
      port: 5432,
      username: 'kong-user',
      password: 'password',
      database: 'kong-db',
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      /**
       * NOTE FOR SYNCHRONIZE:
       * Indicates if database schema should be 
       * auto created on every application launch. 
       * This option is useful during debug and development 
       * (NOT to be used in production).
       */
      synchronize: true,
    };
  }
}