import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
   imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'your_jwt_secret', // move to .env in future
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },],
  controllers: [AuthController]
})
export class AuthModule {}
