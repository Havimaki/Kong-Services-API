import { Version } from "../../version/entity/version.entity";
export declare class Service {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    versions: Version[];
}
