import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EloCoinsService } from './elo-coins.service';
import { EloCoinsController } from './elo-coins.controller';
import { EloCoinsTransaction } from './elo-coins.entity';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EloCoinsTransaction]),
    forwardRef(() => UsersModule),
  ],
  controllers: [EloCoinsController],
  providers: [EloCoinsService],
  exports: [EloCoinsService],
})
export class EloCoinsModule {}
