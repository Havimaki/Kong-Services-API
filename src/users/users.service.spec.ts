require('dotenv').config();
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the User entity', async () => {
      const res = await service.findOne(process.env.USER_NAME)

      expect(res).toEqual({
        id: 1,
        password: process.env.USER_PASSWORD,
        username: process.env.USER_NAME
      })
    });

    it('should return nothing', async () => {
      const res = await service.findOne('random')

      expect(res).toEqual(undefined)
    })
  })
});
