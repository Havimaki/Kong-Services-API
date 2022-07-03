import { VersionService } from './version.service';
import { CreateVersionDto, UpdateVersionDto } from './dto';
import { getVersionsData, createVersionData, updateVersionData, deleteVersionData } from './interface';
export declare class VersionController {
    readonly version: VersionService;
    getVersions(): Promise<getVersionsData>;
    getVersion(serviceId: number): Promise<getVersionsData>;
    createVersion(body: CreateVersionDto): Promise<createVersionData>;
    updateVersion(id: number, body: UpdateVersionDto): Promise<updateVersionData>;
    deleteService(id: number): Promise<deleteVersionData>;
}
