import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { VotingModule } from './voting/voting.module';
import { EloCoinsModule } from './elo-coins/elo-coins.module';

import { User } from './users/user.entity';
import { Vote } from './voting/voting.entity';
import { EloCoinsTransaction } from './elo-coins/elo-coins.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, Vote, EloCoinsTransaction],
        synchronize: true, 
        logging: true,
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    VotingModule,
    EloCoinsModule,
  ],
})
export class AppModule {}