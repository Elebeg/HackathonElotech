import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote, VoteType } from './voting.entity';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UsersService } from '../users/user.service';
import { EloCoinsService } from '../elo-coins/elo-coins.service';

@Injectable()
export class VotingService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    private usersService: UsersService,
    private eloCoinsService: EloCoinsService,
  ) {}

  async createVote(userId: string, createVoteDto: CreateVoteDto): Promise<Vote> {
    const { investmentId, type, feedback } = createVoteDto;

    // Verifica se o usuário já votou neste investimento
    const existingVote = await this.votesRepository.findOne({
      where: { user: { id: userId }, investmentId },
    });

    if (existingVote) {
      throw new ConflictException('Você já votou neste investimento');
    }

    // Se é um voto negativo, feedback é obrigatório
    if (type === VoteType.DISLIKE && !feedback) {
      throw new BadRequestException('Feedback é obrigatório para votos negativos');
    }

    // Busca o usuário
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Cria o voto
    const vote = this.votesRepository.create({
      user,
      investmentId,
      type,
      feedback,
    });

    const savedVote = await this.votesRepository.save(vote);

    // Recompensa com eloCoins
    const rewardAmount = type === VoteType.LIKE ? 10 : 20; // Mais coins para feedback negativo
    await this.eloCoinsService.addCoinsToUser(userId, rewardAmount, `Vote ${type} no investimento ${investmentId}`);

    return savedVote;
  }

  async getUserVotes(userId: string): Promise<Vote[]> {
    return this.votesRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getInvestmentStats(investmentId: string): Promise<any> {
    const votes = await this.votesRepository.find({
      where: { investmentId },
    });

    const likes = votes.filter(vote => vote.type === VoteType.LIKE).length;
    const dislikes = votes.filter(vote => vote.type === VoteType.DISLIKE).length;
    const feedbacks = votes.filter(vote => vote.feedback).map(vote => vote.feedback);

    return {
      investmentId,
      totalVotes: votes.length,
      likes,
      dislikes,
      feedbacks,
      approval: votes.length > 0 ? (likes / votes.length) * 100 : 0,
    };
  }
}