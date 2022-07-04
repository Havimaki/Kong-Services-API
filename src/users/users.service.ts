require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { User } from './interface/user.interface'

@Injectable()
export class UsersService {
  // TODO: move to db
  private readonly users: User[] = [
    {
      id: 1,
      username: process.env.USER_NAME,
      password: process.env.USER_PASSWORD,
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}