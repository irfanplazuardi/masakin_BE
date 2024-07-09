/**
 * User service use to manage user data,
 * like for creating updating and deleting
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, username: string, password: string) {
    const user = this.repo.create({ email, password, username });
    return this.repo.save(user);
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { user_id: id },
    });
  }

  find(email: string = '', username: string = '') {
    return this.repo
      .createQueryBuilder()
      .where('email like :email', { email: `%${email}%` })
      .andWhere('username like :username', { username: `%${username}%` })
      .getOne();
  }

  getAll() {
    return this.repo.find();
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }
    return this.repo.remove(user);
  }
}
