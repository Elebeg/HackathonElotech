import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export enum TransactionType {
  EARNED = 'earned',
  SPENT = 'spent',
}

@Entity('elo_coins_transactions')
export class EloCoinsTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.eloCoinsTransactions)
  user: User;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}