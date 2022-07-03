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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionController = void 0;
const common_1 = require("@nestjs/common");
const version_service_1 = require("./version.service");
const dto_1 = require("./dto");
let VersionController = class VersionController {
    async getVersions() {
        const versions = await this.version.read();
        return { versions };
    }
    async getVersion(serviceId) {
        const versions = await this.version.read(serviceId);
        return { versions };
    }
    async createVersion(body) {
        const result = await this.version.create(body);
        if (!result.id) {
            throw new common_1.InternalServerErrorException('NotCreatedData');
        }
        return { id: result.id };
    }
    async updateVersion(id, body) {
        const result = await this.version.update(id, body);
        return { success: !!result.affected };
    }
    async deleteService(id) {
        const result = await this.version.deleteById(id);
        return { success: !!result.affected };
    }
};
__decorate([
    common_1.Inject(version_service_1.VersionService),
    __metadata("design:type", version_service_1.VersionService)
], VersionController.prototype, "version", void 0);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VersionController.prototype, "getVersions", null);
__decorate([
    common_1.Get(':serviceId'),
    __param(0, common_1.Param('serviceId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VersionController.prototype, "getVersion", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateVersionDto]),
    __metadata("design:returntype", Promise)
], VersionController.prototype, "createVersion", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateVersionDto]),
    __metadata("design:returntype", Promise)
], VersionController.prototype, "updateVersion", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VersionController.prototype, "deleteService", null);
VersionController = __decorate([
    common_1.Injectable(),
    common_1.Controller('versions')
], VersionController);
exports.VersionController = VersionController;
//# sourceMappingURL=version.controller.js.map