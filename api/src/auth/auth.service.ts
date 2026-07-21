import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authentifie un utilisateur et retourne un JWT.
   */
  async login(dto: LoginDto): Promise<{ access_token: string; user: object }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      // Message volontairement générique (évite l'énumération d'emails)
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: String(user.id),
        nom: user.nom,
        email: user.email,
        role: user.role.toLowerCase(),
      },
    };
  }

  /**
   * Retourne l'utilisateur courant depuis le JWT.
   */
  async me(userId: number): Promise<object> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nom: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    return {
      id: String(user.id),
      nom: user.nom,
      email: user.email,
      role: user.role.toLowerCase(),
    };
  }

  /**
   * Valide un utilisateur à partir du payload JWT (utilisé par JwtStrategy).
   */
  async validateUser(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Session invalide');
    }

    return {
      id: user.id,
      email: user.email,
      nom: user.nom,
      role: user.role,
    };
  }
}
