import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { VotingService } from './voting.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('voting')
@UseGuards(JwtAuthGuard)
export class VotingController {
  constructor(private readonly votingService: VotingService) {}

  @Post()
  async createVote(@Request() req, @Body() createVoteDto: CreateVoteDto) {
    return this.votingService.createVote(req.user.id, createVoteDto);
  }

  @Get('my-votes')
  async getMyVotes(@Request() req) {
    return this.votingService.getUserVotes(req.user.id);
  }

  @Get('stats/:investmentId')
  async getInvestmentStats(@Param('investmentId') investmentId: string) {
    return this.votingService.getInvestmentStats(investmentId);
  }
}