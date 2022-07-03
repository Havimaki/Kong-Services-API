"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = 5000;
    app.setGlobalPrefix('api');
    console.log('Port running on: ', port);
    await app.listen(port, () => {
        console.log('[WEB]', 'http://localhost:5000');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map