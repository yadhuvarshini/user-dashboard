import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, firstName, lastName, role } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || UserRole.USER,
    });

    return this.userRepository.save(user);
  }
}
