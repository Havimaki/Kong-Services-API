import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VersionService } from './version.service';
import { Version } from './entity/version.entity';
import {
  CreateVersionDto,
  UpdateVersionDto,
} from './dto';
import { Service } from 'src/service/entity/service.entity';

describe('VersionService - repository', () => {
  let moduleRef: TestingModule;
  let service: VersionService;
  let serviceEntity: Service;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        VersionService,
        {
          provide: getRepositoryToken(Version),
          useValue: sinon.createStubInstance(Repository)
        },
      ],
    }).compile();
    service = moduleRef.get<VersionService>(VersionService);
    service.repository.createQueryBuilder =
      jest.fn()
        .mockImplementation(() => ({
          where: jest.fn(() => ({
            getMany: jest.fn(),
            getOne: jest.fn(),
            getCount: jest.fn(),
          })),
        }));

  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call save() with expected arguments', async () => {
      // Given
      const body: CreateVersionDto = {
        name: "hello",
        description: "hello",
        serviceId: 1,
        number: 1.0,
      }
      const versionEntity: CreateVersionDto = {
        description: "hello",
        name: "hello",
        number: 1,
        serviceId: 1,
      };
      const respositorySpy = jest.spyOn(service.repository, 'save')

      // When
      await service.create(body);

      // Then
      expect(respositorySpy).toHaveBeenCalledWith(versionEntity);
    });
  });

  describe('read', () => {
    it('should call queryBuilder only once', async () => {
      // Given
      const serviceId: number = 1;

      // When
      await service.read(serviceId);

      // Then
      expect(service.repository.createQueryBuilder).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('Should call findOne() with the id parameter', async () => {
      // Given 
      const id = 1;
      const versionEntity: UpdateVersionDto = {
        description: "hello",
        name: "hello",
      };
      const record: Version = {
        id,
        serviceId: 1,
        name: 'Name',
        number: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
        service: serviceEntity,
      }
      const respositorySpy = jest.spyOn(service.repository, 'findOne').mockResolvedValue(record)

      // When
      await service.update(id, versionEntity);

      // Then
      expect(respositorySpy).toHaveBeenCalledWith({ where: { id } });
    })
  });

  describe('deleteById', () => {
    xit('should call queryBuilder twice', async () => {
      /// Given
      const id: number = 1;
      const record: Version = {
        id,
        serviceId: 1,
        name: "name",
        number: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
        service: serviceEntity,
      };
      const respositorySpy = jest.spyOn(service.repository, 'createQueryBuilder');

      // When
      await service.deleteById(id);

      // Then
      expect(service.repository.createQueryBuilder).toHaveBeenCalledTimes(2);
    })
  });

  describe('deleteByServiceId', () => {
    xit('should call queryBuilder only once', async () => {
      /// Given
      const id: number = 1;
      const record: Version[] = [{
        id,
        serviceId: 1,
        name: "name",
        number: 1.0,
        createdAt: new Date(),
        updatedAt: new Date(),
        service: serviceEntity,
      }];
      // const respositorySpy = jest.spyOn(service.repository, 'createQueryBuilder');

      // When
      await service.deleteById(id);

      // Then
      expect(service.repository.createQueryBuilder).toHaveBeenCalledTimes(2);
    })
  });

  afterAll(async () => {
    await moduleRef?.close();
  });
});