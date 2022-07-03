import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';
import { Service } from '../service/entity/service.entity';
import { Version } from './entity/version.entity';
import {
  CreateVersionDto,
  UpdateVersionDto,
} from './dto';

describe('Version Controller', () => {
  let moduleRef: TestingModule;
  let controller: VersionController;
  let service: VersionService;
  let serviceEntity: Service;;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [VersionController],
      providers: [
        VersionService,
        {
          provide: getRepositoryToken(Version),
          useValue: sinon.createStubInstance(Repository)
        },
      ],
    }).compile();

    service = moduleRef.get<VersionService>(VersionService);
    controller = moduleRef.get<VersionController>(VersionController);
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET', () => {
    it('should return read() result', async () => {
      // Given
      const records: Version[] = [{
        id: 1,
        serviceId: 1,
        name: faker.random.words(),
        description: faker.random.words(),
        number: faker.datatype.float(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        service: serviceEntity,
      }]

      jest.spyOn(service, 'read').mockResolvedValue(records);

      // When
      const res = await controller.getVersion(1)

      // Then
      expect(res).toEqual({ versions: records })
    })
  });

  describe('GET /:serviceId', () => {
    it('should return read() result', async () => {
      // Given
      const records = [{
        id: 1,
        serviceId: 1,
        name: faker.random.words(),
        description: faker.random.words(),
        number: faker.datatype.float(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        service: serviceEntity,
      }]
      jest.spyOn(service, 'read').mockResolvedValue(records);

      // When
      const res = await controller.getVersion(1)

      // Then
      expect(res).toEqual({ versions: records })
    });
  });

  describe('POST', () => {
    const id: number = faker.datatype.number();
    const serviceId: number = faker.datatype.number();
    const createVersionBody: CreateVersionDto = {
      name: faker.random.words(),
      description: faker.random.words(),
      number: faker.datatype.number(),
      serviceId: faker.datatype.number(),
    };
    const record: Version = {
      id: 1,
      serviceId: 1,
      name: faker.random.words(),
      description: faker.random.words(),
      number: faker.datatype.float(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      service: serviceEntity,
    };
    it('should new service id and version id', async () => {
      // Given
      jest.spyOn(service, 'create').mockResolvedValue(record);

      // When
      const res = await controller.createVersion(createVersionBody)

      // Then
      expect(res).toEqual({ id: record.id })
    })

    it('should throw error', async () => {
      // Given
      jest.spyOn(service, 'create').mockResolvedValue(null);

      // When
      // Then
      await expect(
        controller.createVersion(createVersionBody)
      ).rejects.toThrowError();
    })
  });

  describe('PUT /:id', () => {
    const id: number = faker.datatype.number();
    const updateBody: UpdateVersionDto = {
      name: "Updated",
      description: "Updated",
    };

    it('should call update() with the id param and return success', async () => {
      // Given
      jest.spyOn(service, 'update').mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });

      // When
      const res = await controller.updateVersion(id, updateBody)

      // Then
      expect(res).toEqual({ success: true })
    })

    it('should call update() with the id param and return fail', async () => {
      // Given
      jest.spyOn(service, 'update').mockResolvedValue({ generatedMaps: [], raw: [], affected: 0 });

      // When
      const res = await controller.updateVersion(id, updateBody)

      // Then
      expect(res).toEqual({ success: false })
    })
  });

  describe('DELETE /:id', () => {
    it('should call delete() with the id param and return success', async () => {
      // Given
      jest.spyOn(service, 'deleteById').mockResolvedValue({ raw: [], affected: 0 });

      // When
      const res = await controller.deleteService(1)

      // Then
      expect(res).toEqual({ success: false })
    })

    it('should call delete() with the id param and return fail', async () => {
      // Given
      jest.spyOn(service, 'deleteById').mockResolvedValue({ raw: [], affected: 1 });

      // When
      const res = await controller.deleteService(1)

      // Then
      expect(res).toEqual({ success: true })
    })

  });
});
