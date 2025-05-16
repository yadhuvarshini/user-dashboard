import { Body, Controller, Post, Get, Request, Put, Delete, Param, RawBody, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/role.enum';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)

export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  // ✅ GET /user/me - return current user info
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user; // comes from decoded JWT payload
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('admin-users')
  getAdminArea() {
    return { message: 'Admins and Super Admins only' };
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto, @Request() req) {
    if (
      req.user.role === Role.ADMIN &&
      createUserDto.role !== Role.USER as unknown as typeof createUserDto.role
    ) {
      throw new ForbiddenException('Admins can only create normal users');
    }
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const targetUser = await this.userService.findById(id);
    if (!targetUser) {
      throw new ForbiddenException('User not found');
    }

    if (
      req.user.role === Role.ADMIN &&
      (targetUser.role === Role.ADMIN.toString() || targetUser.role === Role.SUPER_ADMIN.toString())
    ) {
      throw new ForbiddenException('Admins cannot edit admin or super admin users');
    }

    if (
      req.user.role === Role.ADMIN &&
      updateUserDto.role &&
      updateUserDto.role !== Role.USER.toString()
    ) {
      throw new ForbiddenException('Admins cannot change user roles');
    }

    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async deleteUser(@Param('id') id: string, @Request() req) {
    const targetUser = await this.userService.findById(id);
    if (
      req.user.role === Role.ADMIN &&
      (targetUser.role === Role.ADMIN.toString() || targetUser.role === Role.SUPER_ADMIN.toString())
    ) {
      throw new ForbiddenException('Admins cannot delete admin or super admin users');
    }
    return this.userService.deleteUser(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
@Get()
async getAllUsers(): Promise<User[]> {
  return this.userService.findAll();
}
}

