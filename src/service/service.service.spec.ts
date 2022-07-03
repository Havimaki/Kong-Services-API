import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { ServiceService } from './service.service';
import { VersionService } from '../version/version.service';
import { Service } from './entity/service.entity';

describe('ServiceService - repository', () => {
  let moduleRef: TestingModule;
  let service: ServiceService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ServiceService,
        VersionService,
        Connection,
        {
          provide: getRepositoryToken(Service),
          useValue: sinon.createStubInstance(Repository)
        },
      ],
    }).compile();
    service = moduleRef.get<ServiceService>(ServiceService);
    service.repository.createQueryBuilder =
      jest.fn()
        .mockImplementation(() => ({
          innerJoinAndSelect: jest.fn(),
          where: jest.fn(),
          orderBy: jest.fn(),
          limit: jest.fn(),
          offset: jest.fn(),
          getManyAndCount: jest.fn(),
        }));
  })


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {

  });

  describe('read', () => {

  });

  describe('update', () => {

  });

  describe('delete', () => {

  });

  afterAll(async () => {
    await moduleRef?.close();
  });
});