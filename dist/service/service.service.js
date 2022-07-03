"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const service_entity_1 = require("./entity/service.entity");
const version_service_1 = require("../version/version.service");
const dto_1 = require("../version/dto");
let ServiceService = class ServiceService {
    async create(body) {
        let serviceRecord;
        let versionRecord;
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const service = new service_entity_1.Service();
            service.name = body.serviceName;
            service.description = body.serviceDescription || null;
            serviceRecord = await this.repository.save(service);
            const version = new dto_1.CreateVersionDto();
            version.name = body.versionName;
            version.description = body.versionDescription || null;
            version.number = Number(body.versionNumber);
            version.serviceId = Number(serviceRecord.id);
            versionRecord = await this.versionService.create(version);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.log('Error: ', error);
            throw new common_1.InternalServerErrorException('NotCreatedData');
        }
        finally {
            await queryRunner.release();
        }
        return {
            service: serviceRecord,
            version: versionRecord,
        };
    }
    async readMany(query) {
        const { keywords, sortField, sortDirection, limit, offset, } = query;
        const [services, count] = await this.repository
            .createQueryBuilder("service")
            .innerJoinAndSelect("service.versions", "version")
            .where(`
        service.name ILIKE any(ARRAY[:...keywords]) OR
        service.description ILIKE any(ARRAY[:...keywords]) 
        `, { keywords })
            .orderBy(`service.${sortField}`, sortDirection)
            .limit(limit)
            .offset(offset)
            .getManyAndCount();
        return {
            services: services.map(s => ({
                id: s.id,
                name: s.name,
                description: s.description,
                versions: s.versions,
                versionCount: s.versions.length,
            })),
            serviceCount: count,
            offset: offset + 1,
            limit: Number(limit),
        };
    }
    async readOne(id) {
        return this.repository
            .createQueryBuilder("service")
            .where("service.id = :id", { id })
            .innerJoinAndSelect("service.versions", "version")
            .getOne();
    }
    async update(id, data) {
        const service = await this.repository.findOne({ where: { id } });
        if (!service) {
            throw new common_1.HttpException('Service does not exist!', 404);
        }
        return this.repository.update(id, data);
    }
    async delete(id) {
        const service = await this.repository.findOne({ where: { id } });
        if (!service) {
            throw new common_1.HttpException('Service does not exist!', 404);
        }
        await this.repository.softDelete(id);
        return this.versionService.deleteByServiceId(id);
    }
};
__decorate([
    common_1.Inject(typeorm_1.Connection),
    __metadata("design:type", typeorm_1.Connection)
], ServiceService.prototype, "connection", void 0);
__decorate([
    common_1.Inject(version_service_1.VersionService),
    __metadata("design:type", version_service_1.VersionService)
], ServiceService.prototype, "versionService", void 0);
__decorate([
    typeorm_2.InjectRepository(service_entity_1.Service),
    __metadata("design:type", typeorm_3.Repository)
], ServiceService.prototype, "repository", void 0);
ServiceService = __decorate([
    common_1.Injectable()
], ServiceService);
exports.ServiceService = ServiceService;
//# sourceMappingURL=service.service.js.map