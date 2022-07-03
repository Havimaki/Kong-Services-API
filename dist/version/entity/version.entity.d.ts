import { Service } from "../../service/entity/service.entity";
export declare class Version {
    id: number;
    serviceId: number;
    name: string;
    description?: string;
    number: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    service: Service;
}
