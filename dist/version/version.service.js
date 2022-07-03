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
exports.VersionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const version_entity_1 = require("./entity/version.entity");
let VersionService = class VersionService {
    async create(dto) {
        const version = {
            serviceId: Number(dto.serviceId),
            name: dto.name,
            description: dto.description || null,
            number: Number(dto.number)
        };
        return this.repository.save(version);
    }
    async read(serviceId) {
        const queryBuilder = this.repository.createQueryBuilder("version");
        if (serviceId) {
            return queryBuilder
                .where("version.serviceId = :serviceId", { serviceId })
                .getMany();
        }
        return queryBuilder.getMany();
    }
    async update(id, data) {
        const version = await this.repository.findOne({ where: { id } });
        if (!version) {
            throw new common_1.HttpException('Service does not exist!', 404);
        }
        return this.repository.update(id, data);
    }
    async deleteById(id) {
        const version = await this.repository
            .createQueryBuilder("version")
            .where("version.id = :id", { id })
            .getOne();
        if (!version) {
            throw new common_1.HttpException('Version does not exist!', 404);
        }
        const versionCount = await this.repository
            .createQueryBuilder("version")
            .where("version.serviceId = :serviceId", { serviceId: version.serviceId })
            .getCount();
        if (versionCount <= 1) {
            throw new common_1.InternalServerErrorException('EntityIndexError');
        }
        return this.repository.softDelete(id);
    }
    async deleteByServiceId(serviceId) {
        const versions = await this.repository
            .createQueryBuilder("version")
            .where("version.id = :serviceId", { serviceId })
            .getMany();
        if (!versions[0].id) {
            throw new common_1.HttpException('Version does not exist!', 404);
        }
        return this.repository.softDelete(serviceId);
    }
};
__decorate([
    typeorm_1.InjectRepository(version_entity_1.Version),
    __metadata("design:type", typeorm_2.Repository)
], VersionService.prototype, "repository", void 0);
VersionService = __decorate([
    common_1.Injectable()
], VersionService);
exports.VersionService = VersionService;
//# sourceMappingURL=version.service.js.map