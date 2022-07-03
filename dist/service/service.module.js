"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const service_controller_1 = require("./service.controller");
const service_service_1 = require("./service.service");
const version_module_1 = require("../version/version.module");
const service_entity_1 = require("../service/entity/service.entity");
const version_entity_1 = require("../version/entity/version.entity");
let ServiceModule = class ServiceModule {
};
ServiceModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                service_entity_1.Service,
                version_entity_1.Version,
            ]),
            version_module_1.VersionModule,
        ],
        controllers: [service_controller_1.ServiceController],
        providers: [service_service_1.ServiceService]
    })
], ServiceModule);
exports.ServiceModule = ServiceModule;
//# sourceMappingURL=service.module.js.map