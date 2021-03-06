import {
  Inject,
  Injectable,
  Logger,
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
  name: string = 'ServiceService';
  private readonly logger = new Logger();

  @Inject(Connection)
  private connection: Connection

  @Inject(VersionService)
  private versionService: VersionService

  @InjectRepository(Service)
  readonly repository: Repository<Service>;

  public async create(body: CreateServiceDto): Promise<CreateServiceVersionData> {
    this.logger.log(this.name, 'create.')
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
    this.logger.log(this.name, 'readMany.')
    const {
      keywords,
      sortField,
      sortDirection,
      limit,
      offset,
    } = query;
    const [services, count] = await this.repository
      .createQueryBuilder("service")
      .where(`
        (service.name ILIKE any(ARRAY[:...keywords]) OR
        service.description ILIKE any(ARRAY[:...keywords]))
        `, { keywords })
      .orderBy(`service.${sortField}`, sortDirection)
      .limit(limit)
      .offset(offset)
      .getManyAndCount();

    if (services.length == 0) {
      return {
        services: [],
        serviceCount: count,
        offset: (
          Number(offset) <= 1 ?
            Number(offset) + 1 :
            Number(offset) / Number(limit) + 1
        ),
        limit: Number(limit),
      };
    };

    const serviceIds = services.map(s => `${s.id}`)
    const serviceWithAssoc = await this.repository
      .createQueryBuilder("service")
      .where(`service.id IN (:...serviceIds)`, { serviceIds })
      .orderBy(`service.${sortField}`, sortDirection)
      .innerJoinAndSelect("service.versions", "version")
      .getMany();

    return {
      services: serviceWithAssoc.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        versions: s.versions.map(v => ({
          id: v.id,
          name: v.name,
          description: v.description,
          number: Number(v.number)
        })),
        versionCount: s.versions.length,
      })),
      serviceCount: count,
      offset: (
        Number(offset) <= 1 ?
          Number(offset) + 1 :
          Number(offset) / Number(limit) + 1
      ),
      limit: Number(limit),
    }
  }

  public async readOne(id: number): Promise<ServiceWithAssociations | null> {
    this.logger.log(this.name, 'readOne.')

    const record = await this.repository
      .createQueryBuilder("service")
      .where("service.id = :id", { id })
      .innerJoinAndSelect("service.versions", "version")
      .getOne();

    return {
      id: record.id,
      name: record.name,
      description: record.description,
      versions: record.versions.map(v => ({
        id: v.id,
        name: v.name,
        description: v.description,
        number: Number(v.number),
      })),
    }
  }

  public async update(id: number, data: UpdateServiceDto): Promise<UpdateResult> {
    this.logger.log(this.name, 'update.')
    const service = await this.repository.findOne({ where: { id } })
    if (!service) {
      throw new HttpException('Service does not exist!', 404);
    }
    return this.repository.update(id, data);
  }

  public async delete(id: number): Promise<DeleteResult> {
    this.logger.log(this.name, 'delete.')
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
