import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './user.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

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

    // src/user/user.service.ts
    async findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        const updated = Object.assign(user, updateUserDto);
        return this.userRepository.save(updated);
    }

    async deleteUser(id: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        await this.userRepository.remove(user);
        return { message: 'User deleted successfully' };
    }

    async findById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user; 
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

}
