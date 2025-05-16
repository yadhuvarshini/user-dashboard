import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',   // or your PostgreSQL username
      password: '1234',   // or your PostgreSQL password
      database: 'userdb',     // the DB you just created
      entities: [],              // We'll add entities later
      autoLoadEntities: true, // loads entity classes automatically
      synchronize: true,      // auto-creates tables based on entities (only for dev)
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
