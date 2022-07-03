"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmConfigService = void 0;
class TypeOrmConfigService {
    createTypeOrmOptions() {
        return {
            type: 'postgres',
            host: 'kong-db',
            port: 5432,
            username: 'kong-user',
            password: 'password',
            database: 'kong-db',
            entities: ['dist/**/*.entity.{ts,js}'],
            migrations: ['dist/migrations/*.{ts,js}'],
            synchronize: true,
        };
    }
}
exports.TypeOrmConfigService = TypeOrmConfigService;
//# sourceMappingURL=typeorm.service.js.map