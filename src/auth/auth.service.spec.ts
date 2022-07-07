require('dotenv').config();
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user id and username ', async () => {
      jest.spyOn(service.usersService, 'findOne').mockResolvedValue({
        id: 1,
        username: process.env.USER_NAME,
        password: process.env.USER_PASSWORD,
      });

      const res = await service.validateUser({
        username: process.env.USER_NAME,
        password: process.env.USER_PASSWORD,
      });

      expect(res).toEqual({
        id: 1,
        username: process.env.USER_NAME
      });
    })

    it('should return null', async () => {
      jest.spyOn(service.usersService, 'findOne').mockResolvedValue(undefined);

      const res = await service.validateUser({
        username: process.env.USER_NAME,
        password: process.env.USER_PASSWORD,
      });

      expect(res).toEqual(null);
    });
  })

  describe('login', () => {
    it('should return the user id and username ', async () => {
      const token = 'some_token';
      jest.spyOn(service.jwtService, 'sign').mockReturnValue(token);

      const res = await service.login({
        username: process.env.USER_NAME,
        id: 1,
      });

      expect(res).toEqual({ access_token: token });
    })
  });
});
