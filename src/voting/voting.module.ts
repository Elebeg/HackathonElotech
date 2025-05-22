import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotingService } from './voting.service';
import { VotingController } from './voting.controller';
import { Vote } from './voting.entity';
import { UsersModule } from '../users/user.module';
import { EloCoinsModule } from '../elo-coins/elo-coins.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vote]),
    UsersModule,
    EloCoinsModule,
  ],
  controllers: [VotingController],
  providers: [VotingService],
})
export class VotingModule {}