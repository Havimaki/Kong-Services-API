import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Version } from './entity/version.entity';
import { CreateVersionDto, UpdateVersionDto } from './dto';
export declare class VersionService {
    readonly repository: Repository<Version>;
    create(dto: CreateVersionDto): Promise<Version | null>;
    read(serviceId?: number): Promise<Version[] | []>;
    update(id: number, data: UpdateVersionDto): Promise<UpdateResult>;
    deleteById(id: number): Promise<DeleteResult>;
    deleteByServiceId(serviceId?: number): Promise<DeleteResult>;
}
