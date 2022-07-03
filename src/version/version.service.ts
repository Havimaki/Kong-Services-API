import {
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Version } from './entity/version.entity';
import {
  CreateVersionDto,
  UpdateVersionDto,
} from './dto';

@Injectable()
export class VersionService {
  @InjectRepository(Version)
  readonly repository: Repository<Version>;

  public async create(dto: CreateVersionDto): Promise<Version | null> {
    const version: CreateVersionDto = {
      serviceId: Number(dto.serviceId),
      name: dto.name,
      description: dto.description || null,
      number: Number(dto.number)
    }

    return this.repository.save(version);
  }

  public async read(serviceId?: number): Promise<Version[] | []> {
    const queryBuilder = this.repository.createQueryBuilder("version");

    if (serviceId) {
      return queryBuilder
        .where("version.serviceId = :serviceId", { serviceId })
        .getMany();
    }
    return queryBuilder.getMany();
  }

  public async update(id: number, data: UpdateVersionDto): Promise<UpdateResult> {
    const version = await this.repository.findOne({ where: { id } })
    if (!version) {
      throw new HttpException('Service does not exist!', 404);
    }
    return this.repository.update(id, data);
  }

  public async deleteById(id: number): Promise<DeleteResult> {
    const version = await this.repository
      .createQueryBuilder("version")
      .where("version.id = :id", { id })
      .getOne();
    if (!version) {
      throw new HttpException('Version does not exist!', 404);
    }

    const versionCount = await this.repository
      .createQueryBuilder("version")
      .where("version.serviceId = :serviceId", { serviceId: version.serviceId })
      .getCount();

    if (versionCount <= 1) {
      throw new InternalServerErrorException('EntityIndexError');
    }

    /**
     * Choosing to use softDelete, as typeORM automatically 
     * filters out records where deletedAt is not null.
     * You can add withDeleted() if you do want to include soft deleted
     * records in a select query.
     * A soft deletion accomplishes in theory what a hard deletion is,
     * except it's a bit safer and allows for a papertrail 
     * of every record.
    */
    return this.repository.softDelete(id)
  }

  public async deleteByServiceId(serviceId?: number): Promise<DeleteResult> {
    const versions = await this.repository
      .createQueryBuilder("version")
      .where("version.id = :serviceId", { serviceId })
      .getMany();

    if (!versions[0].id) {
      throw new HttpException('Version does not exist!', 404);
    }

    /**
     * Choosing to use softDelete, as typeORM automatically 
     * filters out records where deletedAt is not null.
     * You can add withDeleted() if you do want to include soft deleted
     * records in a select query.
     * A soft deletion accomplishes in theory what a hard deletion is,
     * except it's a bit safer and allows for a papertrail 
     * of every record.
    */
    return this.repository.softDelete(serviceId)
  }
}