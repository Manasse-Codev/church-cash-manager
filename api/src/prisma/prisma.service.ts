import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private static pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL manquant dans les variables d\'environnement');
    }

    if (!PrismaService.pool) {
      PrismaService.pool = new Pool({ connectionString });
    }
    const adapter = new PrismaPg(PrismaService.pool);

    super({
      adapter,
      log: process.env.NODE_ENV === 'development'
        ? ['warn', 'error']
        : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Connexion à la base de données établie avec le driver adapter');
    } catch (error) {
      this.logger.error('❌ Échec de la connexion à la base de données', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Connexion à la base de données fermée');
  }
}
