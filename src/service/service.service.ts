import {
  Inject,
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  UpdateResult,
  DeleteResult,
} from 'typeorm';
import { Service } from './entity/service.entity';
import { Version } from '../version/entity/version.entity';
import {
  CreateServiceDto,
  UpdateServiceDto,
} from './dto';
import { VersionService } from '../version/version.service';
import { CreateVersionDto } from '../version/dto';
import {
  CreateServiceVersionData,
  GetServicesData,
  ServiceWithAssociations,
  serviceQuery,
} from './interface';


@Injectable()
export class ServiceService {
  @Inject(Connection)
  private connection: Connection

  @Inject(VersionService)
  private versionService: VersionService

  @InjectRepository(Service)
  readonly repository: Repository<Service>;

  public async create(body: CreateServiceDto): Promise<CreateServiceVersionData> {
    let serviceRecord: Service;
    let versionRecord: Version;

    /**
     * Using queryRunner() as a transaction block,
     * as services require at least 1 associated version
     * */
    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const service: Service = new Service();
      service.name = body.serviceName;
      service.description = body.serviceDescription || null;
      serviceRecord = await this.repository.save(service);

      const version: CreateVersionDto = new CreateVersionDto();
      version.name = body.versionName;
      version.description = body.versionDescription || null;
      version.number = Number(body.versionNumber);
      version.serviceId = Number(serviceRecord.id);
      versionRecord = await this.versionService.create(version)

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('Error: ', error)
      throw new InternalServerErrorException('NotCreatedData');
    } finally {
      await queryRunner.release(); // end transaction
    }

    return {
      service: serviceRecord,
      version: versionRecord,
    }
  }

  public async readMany(query: serviceQuery): Promise<GetServicesData> {
    const {
      keywords,
      sortField,
      sortDirection,
      limit,
      offset,
    } = query;
    const [services, count] = await this.repository
      .createQueryBuilder("service")
      .innerJoinAndSelect("service.versions", "version")
      .where(`
        service.name ILIKE any(ARRAY[:...keywords]) OR
        service.description ILIKE any(ARRAY[:...keywords]) 
        `, { keywords })
      .orderBy(`service.${sortField}`, sortDirection)
      .limit(limit)
      .offset(offset)
      .getManyAndCount();

    return {
      services: services.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        versions: s.versions.map(v => ({
          name: v.name,
          description: v.description,
          number: Number(v.number)
        })),
        versionCount: s.versions.length,
      })),
      serviceCount: count,
      offset: offset + 1,
      limit: Number(limit),
    }
  }

  public async readOne(id: number): Promise<ServiceWithAssociations | null> {
    return this.repository
      .createQueryBuilder("service")
      .where("service.id = :id", { id })
      .innerJoinAndSelect("service.versions", "version")
      .getOne();
  }

  public async update(id: number, data: UpdateServiceDto): Promise<UpdateResult> {
    const service = await this.repository.findOne({ where: { id } })
    if (!service) {
      throw new HttpException('Service does not exist!', 404);
    }
    return this.repository.update(id, data);
  }

  public async delete(id: number): Promise<DeleteResult> {
    const service = await this.repository.findOne({ where: { id } })
    if (!service) {
      throw new HttpException('Service does not exist!', 404);
    }

    /**
     * Choosing to use softDelete, as typeORM automatically 
     * filters out records where deletedAt is not null.
     * You can add withDeleted() if you do want to include soft deleted
     * records in a select query.
     * A soft deletion accomplishes in theory what a hard deletion is,
     * except it's a bit safer and allows for a papertrail of every record.
     */
    await this.repository.softDelete(id)
    return this.versionService.deleteByServiceId(id)
  }
}
