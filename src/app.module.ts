import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './iam/iam.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [DatabaseConfig],
      isGlobal: true,
    }),
    CoffeesModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('database.host'),
          port: +configService.get('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.database'),
          autoLoadEntities: true,
          synchronize: true, //turn false in prod
        };
      },
    }),
    IamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
