import { InternalServerErrorException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { Service } from './entity/service.entity';
import {
  CreateServiceDto,
  UpdateServiceDto,
} from './dto';
import {
  GetServicesData,
  CreateServiceVersionData,
  ServiceWithAssociations,
} from './interface';

describe('Service Controller', () => {
  let controller: ServiceController;
  let service: ServiceService;
  let serviceEntity: Service;

  beforeEach(() => {
    service = new ServiceService();
    controller = new ServiceController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET', () => {
    it('should return readMany() with default query', async () => {
      // Given
      jest.spyOn(service, 'readMany').mockResolvedValue({
        services: [],
        serviceCount: 0,
        offset: 1,
        limit: 10,
      });

      // When
      await controller.getServices({})

      // Then
      expect(service.readMany).toHaveBeenCalledWith({
        keywords: ['%%'],
        sortField: 'created_at',
        sortDirection: 'DESC',
        limit: 12,
        offset: 0
      });
    });

    it('should return readMany() returned payload', async () => {
      // Given
      const serviceEntity = new Service();
      const records: GetServicesData = {
        services: [{
          id: 1,
          name: faker.random.words(),
          description: faker.random.words(),
          versions: [{
            id: 1,
            name: faker.random.words(),
            description: faker.random.words(),
            number: 1.0,
          }],
        }],
        serviceCount: 1,
        offset: 1,
        limit: 5,
      };
      jest.spyOn(service, 'readMany').mockResolvedValue(records);

      // When
      const res = await controller.getServices({})

      // Then
      expect(res).toEqual(records);
    });
  });

  describe('GET /:id', () => {
    it('should return readOne() result', async () => {
      // Given
      const serviceEntity = new Service();
      const record: ServiceWithAssociations = {
        id: 1,
        name: faker.random.words(),
        description: faker.random.words(),
        versions: [{
          id: 1,
          name: faker.random.words(),
          description: faker.random.words(),
          number: 1.0,
        }],
      };
      jest.spyOn(service, 'readOne').mockResolvedValue(record);

      // When
      const res = await controller.getService(1)

      // Then
      expect(res).toEqual(record)
    })
  });

  describe('POST', () => {
    const id: number = faker.datatype.number();
    const serviceId: number = faker.datatype.number();
    const createServiceBody: CreateServiceDto = {
      serviceName: faker.random.words(),
      serviceDescription: faker.random.words(),
      versionName: faker.random.words(),
      versionDescription: faker.random.words(),
      versionNumber: faker.datatype.number(),
    };

    it('should new service id and version id', async () => {
      // Given
      const records: CreateServiceVersionData = {
        service: {
          id: serviceId,
          name: faker.random.words(),
          description: faker.random.words(),
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          versions: []
        },
        version: {
          id: 1,
          serviceId,
          number: 1.0,
          name: faker.random.words(),
          description: faker.random.words(),
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          service: serviceEntity,

        },
      }
      jest.spyOn(service, 'create').mockResolvedValue(records);

      // When
      const res = await controller.createService(createServiceBody)

      // Then
      expect(res).toEqual({
        serviceId: records.service.id,
        versionId: records.version.id,
      })
    })

    it('should throw error', async () => {
      // Given
      jest.spyOn(service, 'create').mockRejectedValue(new InternalServerErrorException());

      // When
      // Then
      await expect(controller.createService(createServiceBody)).rejects.toThrowError();
    })
  });

  describe('PUT /:id', () => {
    const id: number = faker.datatype.number();
    const updateBody: UpdateServiceDto = {
      name: "Updated",
      description: "Updated",
    };

    it('should call update() with the id param and return success', async () => {
      // Given
      jest.spyOn(service, 'update').mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });

      // When
      const res = await controller.updateService(id, updateBody)

      // Then
      expect(res).toEqual({ success: true })
    })

    it('should call update() with the id param and return fail', async () => {
      // Given
      jest.spyOn(service, 'update').mockResolvedValue({ generatedMaps: [], raw: [], affected: 0 });

      // When
      const res = await controller.updateService(id, updateBody)

      // Then
      expect(res).toEqual({ success: false })
    })
  });

  describe('DELETE /:id', () => {
    it('should call delete() with the id param - SUCCESS', async () => {
      // Given
      jest.spyOn(service, 'delete').mockResolvedValue({ raw: [], affected: 0 });

      // When
      const res = await controller.deleteService(1)

      // Then
      expect(res).toEqual({ success: false })
    })

    it('should call delete() with the id param - FAIL', async () => {
      // Given
      jest.spyOn(service, 'delete').mockResolvedValue({ raw: [], affected: 1 });

      // When
      const res = await controller.deleteService(1)

      // Then
      expect(res).toEqual({ success: true })
    })

  });
});
