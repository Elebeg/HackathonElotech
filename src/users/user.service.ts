import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { nome, sobrenome, email, cpf, senha } = createUserDto;

    // Verifica se email já existe
    const existingUserByEmail = await this.usersRepository.findOne({ where: { email } });
    if (existingUserByEmail) {
      throw new ConflictException('Email já está em uso');
    }

    // Verifica se CPF já existe
    const cleanCpf = cpf.replace(/[^\d]/g, '');
    const existingUserByCpf = await this.usersRepository.findOne({ where: { cpf: cleanCpf } });
    if (existingUserByCpf) {
      throw new ConflictException('CPF já está cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o usuário
    const user = this.usersRepository.create({
      nome,
      sobrenome,
      email,
      cpf: cleanCpf,
      senha: hashedPassword,
      eloCoins: 100, // Bônus inicial de boas-vindas
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'nome', 'sobrenome', 'email', 'eloCoins', 'createdAt'],
    });
  }

  async updateEloCoins(userId: string, amount: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.eloCoins += amount;
    return this.usersRepository.save(user);
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['votes', 'eloCoinsTransactions'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}