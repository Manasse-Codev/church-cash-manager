import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CaisseModule } from './caisse/caisse.module';
import { InvestisseursModule } from './investisseurs/investisseurs.module';
import { ConstructionModule } from './construction/construction.module';
import { DepartementsModule } from './departements/departements.module';
import { MembresModule } from './membres/membres.module';

@Module({
  imports: [
    // ── Configuration ─────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ── Rate Limiting ─────────────────────────────────────────────────────────
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'global',
          ttl: 60000, // 1 minute
          limit: 100,
        },
      ],
    }),

    // ── Modules applicatifs ───────────────────────────────────────────────────
    PrismaModule,
    AuthModule,
    DashboardModule,
    CaisseModule,
    InvestisseursModule,
    ConstructionModule,
    DepartementsModule,
    MembresModule,
  ],
  providers: [
    // Rate limiting global
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
