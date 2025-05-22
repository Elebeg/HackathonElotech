import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EloCoinsTransaction, TransactionType } from './elo-coins.entity';
import { UsersService } from '../users/user.service';

@Injectable()
export class EloCoinsService {
  constructor(
    @InjectRepository(EloCoinsTransaction)
    private transactionsRepository: Repository<EloCoinsTransaction>,
    private usersService: UsersService,
  ) {}

  async addCoinsToUser(userId: string, amount: number, description: string): Promise<EloCoinsTransaction> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    
    // Atualiza o saldo do usuário
    await this.usersService.updateEloCoins(userId, amount);

    // Registra a transação
    const transaction = this.transactionsRepository.create({
      user,
      amount,
      type: TransactionType.EARNED,
      description,
    });

    return this.transactionsRepository.save(transaction);
  }

  async spendCoins(userId: string, amount: number, description: string): Promise<EloCoinsTransaction> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    
    if (user.eloCoins < amount) {
      throw new BadRequestException('EloCoins insuficientes');
    }

    // Deduz do saldo do usuário
    await this.usersService.updateEloCoins(userId, -amount);

    // Registra a transação
    const transaction = this.transactionsRepository.create({
      user,
      amount,
      type: TransactionType.SPENT,
      description,
    });

    return this.transactionsRepository.save(transaction);
  }

  async getUserTransactions(userId: string): Promise<EloCoinsTransaction[]> {
    return this.transactionsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getLeaderboard(limit: number = 10): Promise<any[]> {
    const users = await this.usersService.findAll();
    return users
      .sort((a, b) => b.eloCoins - a.eloCoins)
      .slice(0, limit)
      .map((user, index) => ({
        position: index + 1,
        nome: user.nome,
        sobrenome: user.sobrenome,
        eloCoins: user.eloCoins,
      }));
  }
}