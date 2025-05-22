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
      useFactory: (configService: ConfigService) => {
        // Railway automaticamente disponibiliza DATABASE_URL
        const databaseUrl = configService.get('DATABASE_URL');
        
        if (databaseUrl) {
          // Configuração para Railway usando DATABASE_URL
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Vote, EloCoinsTransaction],
            synchronize: true, // Para desenvolvimento
            logging: false, // Desabilita logs em produção
            ssl: {
              rejectUnauthorized: false, // Necessário para Railway
            },
          };
        } else {
          // Configuração para desenvolvimento local
          return {
            type: 'postgres',
            host: configService.get('DATABASE_HOST', 'localhost'),
            port: +configService.get<number>('DATABASE_PORT', 5432),
            username: configService.get('DATABASE_USERNAME', 'elocidadao'),
            password: configService.get('DATABASE_PASSWORD', 'elocidadao123'),
            database: configService.get('DATABASE_NAME', 'elocidadao'),
            entities: [User, Vote, EloCoinsTransaction],
            synchronize: true,
            logging: true,
          };
        }
      },
      inject: [ConfigService],
    }),
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'elocidadao-super-secret-key-2024'),
        signOptions: { 
          expiresIn: configService.get('JWT_EXPIRES_IN', '7d') 
        },
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