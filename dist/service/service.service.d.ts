import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Service } from './entity/service.entity';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { CreateServiceVersionData, GetServicesData, ServiceWithAssociations, serviceQuery } from './interface';
export declare class ServiceService {
    private connection;
    private versionService;
    readonly repository: Repository<Service>;
    create(body: CreateServiceDto): Promise<CreateServiceVersionData>;
    readMany(query: serviceQuery): Promise<GetServicesData>;
    readOne(id: number): Promise<ServiceWithAssociations | null>;
    update(id: number, data: UpdateServiceDto): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
