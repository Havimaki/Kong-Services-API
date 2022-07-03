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
exports.ServiceController = void 0;
const common_1 = require("@nestjs/common");
const service_service_1 = require("./service.service");
const dto_1 = require("./dto");
let ServiceController = class ServiceController {
    constructor(service) {
        this.service = service;
    }
    async getServices(q) {
        const { query = "", sort = "createdAt,DESC", limit = 12, offset = 1, } = q;
        const keywords = query.split(',').map((q) => `%${q}%`);
        const sortQuery = sort.split(',').map((s) => s);
        const sortField = sortQuery[0];
        const sortDirection = sortQuery[1].toUpperCase();
        return this.service.readMany({
            keywords,
            sortField,
            sortDirection,
            limit,
            offset: offset - 1,
        });
    }
    async getService(id) {
        return this.service.readOne(id);
    }
    async createService(body) {
        const result = await this.service.create(body);
        if (!result.service || !result.version) {
            throw new common_1.InternalServerErrorException('NotCreatedData');
        }
        return {
            serviceId: result.service.id,
            versionId: result.version.id,
        };
    }
    async updateService(id, body) {
        const result = await this.service.update(id, body);
        return { success: !!result.affected };
    }
    async deleteService(id) {
        const result = await this.service.delete(id);
        return { success: !!result.affected };
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "getServices", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "getService", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateServiceDto]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "createService", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateServiceDto]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "updateService", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "deleteService", null);
ServiceController = __decorate([
    common_1.Controller('services'),
    __metadata("design:paramtypes", [service_service_1.ServiceService])
], ServiceController);
exports.ServiceController = ServiceController;
//# sourceMappingURL=service.controller.js.map