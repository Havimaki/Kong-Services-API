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
exports.Version = void 0;
const typeorm_1 = require("typeorm");
const service_entity_1 = require("../../service/entity/service.entity");
let Version = class Version {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Version.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Version.prototype, "serviceId", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], Version.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 120, nullable: true, default: null }),
    __metadata("design:type", String)
], Version.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ type: "decimal", default: 1.0 }),
    __metadata("design:type", Number)
], Version.prototype, "number", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamp', select: false }),
    __metadata("design:type", Date)
], Version.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamp', select: false }),
    __metadata("design:type", Date)
], Version.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: 'timestamp', select: false }),
    __metadata("design:type", Date)
], Version.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => service_entity_1.Service, (service) => service.versions),
    __metadata("design:type", service_entity_1.Service)
], Version.prototype, "service", void 0);
Version = __decorate([
    typeorm_1.Entity('version'),
    typeorm_1.Unique("UQ_SERVICE_VERSION", ["serviceId", "number"])
], Version);
exports.Version = Version;
//# sourceMappingURL=version.entity.js.map