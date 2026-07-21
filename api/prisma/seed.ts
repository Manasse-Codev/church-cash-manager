import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL manquant dans les variables d\'environnement');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Début du peuplement de la base de données (seeding)...');

  // 1. Nettoyage de la base de données
  console.log('🧹 Nettoyage des anciennes données...');
  await prisma.user.deleteMany();
  await prisma.mouvementCaisse.deleteMany();
  await prisma.versementInvestisseur.deleteMany();
  await prisma.investisseur.deleteMany();
  await prisma.depenseConstruction.deleteMany();
  await prisma.budgetConstruction.deleteMany();
  await prisma.mouvementDepartement.deleteMany();
  await prisma.departement.deleteMany();
  await prisma.membre.deleteMany();
  await prisma.membreFormConfig.deleteMany();

  // 2. Création de l'administrateur par défaut
  console.log('👤 Création des utilisateurs...');
  const passwordHash = await bcrypt.hash('admin123', 12);
  await prisma.user.create({
    data: {
      email: 'admin@eglise.cg',
      nom: 'Administrateur',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  // 3. Configuration par défaut du formulaire d'inscription des membres
  console.log('⚙️ Configuration du formulaire d\'inscription...');
  await prisma.membreFormConfig.create({
    data: {
      id: 1,
      linkToken: 'default-public-token-inscription',
      champs: [
        { label: 'Nom', type: 'text', required: true },
        { label: 'Prénom', type: 'text', required: true },
        { label: 'Téléphone', type: 'tel', required: true },
        { label: 'Catégorie', type: 'select', required: true },
      ],
    },
  });

  // 4. Budget de construction
  console.log('🏗️ Initialisation du budget de construction...');
  await prisma.budgetConstruction.create({
    data: {
      id: 1,
      montant: 25_000_000,
    },
  });

  console.log('✅ Base de données initialisée avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
