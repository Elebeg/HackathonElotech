import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VoteType } from '../voting.entity';

export class CreateVoteDto {
  @IsNotEmpty()
  @IsString()
  investmentId: string;

  @IsEnum(VoteType)
  type: VoteType;

  @IsOptional()
  @IsString()
  feedback?: string;
}
