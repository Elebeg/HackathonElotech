import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Vote } from '../voting/voting.entity';
import { EloCoinsTransaction } from '.././elo-coins/elo-coins.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  sobrenome: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  @Exclude()
  senha: string;

  @Column({ default: 0 })
  eloCoins: number;

  @OneToMany(() => Vote, vote => vote.user)
  votes: Vote[];

  @OneToMany(() => EloCoinsTransaction, transaction => transaction.user)
  eloCoinsTransactions: EloCoinsTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}