-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GESTIONNAIRE', 'LECTEUR');

-- CreateEnum
CREATE TYPE "TypeMouvement" AS ENUM ('ENTREE', 'SORTIE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'GESTIONNAIRE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mouvements_caisse" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "motif" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "type" "TypeMouvement" NOT NULL,
    "par" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mouvements_caisse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investisseurs" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "promesse" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investisseurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versements_investisseur" (
    "id" SERIAL NOT NULL,
    "investisseurId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "methode" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "versements_investisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depenses_construction" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "article" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "fournisseur" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "depenses_construction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_construction" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "montant" DOUBLE PRECISION NOT NULL DEFAULT 25000000,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_construction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departements" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "bg" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "membres" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mouvements_departement" (
    "id" SERIAL NOT NULL,
    "departementId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "motif" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mouvements_departement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membres" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "champsDynamiques" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membre_form_configs" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "champs" JSONB NOT NULL,
    "linkToken" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membre_form_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "mouvements_caisse_date_idx" ON "mouvements_caisse"("date");

-- CreateIndex
CREATE INDEX "mouvements_caisse_type_idx" ON "mouvements_caisse"("type");

-- CreateIndex
CREATE INDEX "investisseurs_categorie_idx" ON "investisseurs"("categorie");

-- CreateIndex
CREATE INDEX "versements_investisseur_investisseurId_idx" ON "versements_investisseur"("investisseurId");

-- CreateIndex
CREATE INDEX "depenses_construction_date_idx" ON "depenses_construction"("date");

-- CreateIndex
CREATE INDEX "depenses_construction_categorie_idx" ON "depenses_construction"("categorie");

-- CreateIndex
CREATE UNIQUE INDEX "departements_nom_key" ON "departements"("nom");

-- CreateIndex
CREATE INDEX "mouvements_departement_departementId_idx" ON "mouvements_departement"("departementId");

-- CreateIndex
CREATE INDEX "membres_categorie_idx" ON "membres"("categorie");

-- CreateIndex
CREATE UNIQUE INDEX "membre_form_configs_linkToken_key" ON "membre_form_configs"("linkToken");

-- AddForeignKey
ALTER TABLE "versements_investisseur" ADD CONSTRAINT "versements_investisseur_investisseurId_fkey" FOREIGN KEY ("investisseurId") REFERENCES "investisseurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mouvements_departement" ADD CONSTRAINT "mouvements_departement_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "departements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
