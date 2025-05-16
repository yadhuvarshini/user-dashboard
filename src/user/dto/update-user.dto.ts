import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '../user.entity';

export class UpdateUserDto {
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(5)
  password?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
