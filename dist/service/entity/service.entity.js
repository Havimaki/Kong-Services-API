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
exports.Service = void 0;
const typeorm_1 = require("typeorm");
const version_entity_1 = require("../../version/entity/version.entity");
let Service = class Service {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Service.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], Service.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 120, default: null }),
    __metadata("design:type", String)
], Service.prototype, "description", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamp', select: false }),
    __metadata("design:type", Date)
], Service.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamp', select: false }),
    __metadata("design:type", Date)
], Service.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.DeleteDateColumn({ type: 'timestamp', select: false }),
    __metadata("design:type", Date)
], Service.prototype, "deletedAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => version_entity_1.Version, (version) => version.service),
    __metadata("design:type", Array)
], Service.prototype, "versions", void 0);
Service = __decorate([
    typeorm_1.Entity('service')
], Service);
exports.Service = Service;
//# sourceMappingURL=service.entity.js.map