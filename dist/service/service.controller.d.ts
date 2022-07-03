import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { GetServicesData, ServiceWithAssociations, CreateServiceData, UpdateServiceData, DeleteServiceData } from './interface';
export declare class ServiceController {
    private readonly service;
    constructor(service: ServiceService);
    getServices(q: any): Promise<GetServicesData | Partial<GetServicesData>>;
    getService(id: number): Promise<ServiceWithAssociations>;
    createService(body: CreateServiceDto): Promise<CreateServiceData>;
    updateService(id: number, body: UpdateServiceDto): Promise<UpdateServiceData>;
    deleteService(id: number): Promise<DeleteServiceData>;
}
