import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { EloCoinsService } from './elo-coins.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('elo-coins')
@UseGuards(JwtAuthGuard)
export class EloCoinsController {
  constructor(private readonly eloCoinsService: EloCoinsService) {}

  @Get('transactions')
  async getMyTransactions(@Request() req) {
    return this.eloCoinsService.getUserTransactions(req.user.id);
  }

  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.eloCoinsService.getLeaderboard(limitNumber);
  }

  @Post('spend')
  async spendCoins(
    @Request() req,
    @Body() body: { amount: number; description: string }
  ) {
    return this.eloCoinsService.spendCoins(req.user.id, body.amount, body.description);
  }
}