import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../users/user.entity';

export enum VoteType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

@Entity('votes')
@Unique(['user', 'investmentId'])
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.votes)
  user: User;

  @Column()
  investmentId: string; 

  @Column({
    type: 'enum',
    enum: VoteType,
  })
  type: VoteType;

  @Column({ nullable: true })
  feedback?: string; 

  @CreateDateColumn()
  createdAt: Date;
}