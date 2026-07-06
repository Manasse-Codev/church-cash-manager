# church-cash-manager

# EgliseFinance

**Application web de gestion financière pour les églises africaines**  
*Remplacez la gestion manuelle par un outil moderne, clair et collaboratif.*

---

## Table des matières

- [Contexte et objectifs](#contexte-et-objectifs)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Architecture technique](#architecture-technique)
- [Stack utilisée](#stack-utilisée)
- [Prérequis](#prérequis)
- [Installation (développement)](#installation-développement)
- [Variables d’environnement](#variables-denvironnement)
- [Base de données](#base-de-données)
- [Lancement en développement](#lancement-en-développement)
- [Déploiement (production)](#déploiement-production)
- [Services externes](#services-externes)
- [Tests et qualité](#tests-et-qualité)
- [Roadmap / Évolutions futures](#roadmap--évolutions-futures)
- [Contribuer](#contribuer)
- [Licence](#licence)

---

## Contexte et objectifs

De nombreuses églises en Afrique gèrent encore leur budget manuellement (cahiers, tableaux papier, fichiers Excel isolés). Cela entraîne des erreurs, une perte de temps et un manque de transparence.  
**EgliseFinance** est une application web complète qui permet de :

- Suivre les engagements et versements des investisseurs pour la construction du temple.
- Gérer la caisse générale (entrées/sorties).
- Suivre les dépenses spécifiques aux chantiers.
- Donner à chaque département de l’église un espace pour ses propres finances.
- Centraliser les informations des fidèles via un formulaire personnalisable partagé par lien.

L’application est pensée pour être simple d’utilisation, accessible même sur des connexions modestes, et facile à héberger localement ou sur un petit serveur.

---

## Fonctionnalités principales

### 📊 Tableau de bord
- Indicateurs synthétiques (solde caisse, fonds construction collectés, promesses vs versements, etc.)
- Graphiques d’évolution mensuelle

### 💰 Investisseurs (construction du temple)
- Enregistrement des investisseurs avec engagement (montant, durée, fréquence)
- Saisie des versements avec mise à jour automatique du **reste à payer**
- Filtres par catégorie, nom, montant
- Export Excel et PDF

### 🏦 Caisse de l’église
- Enregistrement de toutes les entrées et sorties d’argent
- Motif, date, responsable
- Export des mouvements

### 🏗️ Dépenses de construction
- Suivi dédié aux dépenses du chantier (motif, montant, fournisseur)
- Export pour le comité de construction

### 🏢 Départements
- Chaque département peut s’enregistrer et suivre ses propres entrées/sorties
- Vue par département réservée aux responsables

### 👥 Gestion des membres (fidèles)
- Le gestionnaire crée un formulaire d’inscription personnalisé (champs dynamiques)
- Génération d’un lien public (comme Google Forms) partageable via WhatsApp, etc.
- Les inscriptions alimentent automatiquement la liste des membres
- Filtres par nom et catégorie

---

## Architecture technique

L’application suit une architecture **monorepo** avec des conteneurs Docker pour faciliter le déploiement.

```
[ Navigateur ] 
      |
[ Next.js (frontend) ] ───── Appels API ───── [ NestJS (backend API) ]
      |                                              |
      |                                              ├── [ PostgreSQL ]
      |                                              └── [ Python (FastAPI) – exports PDF/Excel ]
      |
[ Pages publiques (formulaires membres) ]
```

- Le frontend Next.js communique avec le backend NestJS via des API REST.
- Le backend utilise Prisma pour interagir avec PostgreSQL.
- Les exports lourds (PDF/Excel avec mise en forme) sont délégués à un microservice Python (FastAPI + WeasyPrint/openpyxl) pour une meilleure qualité et maintenance.
- Tous les services sont conteneurisés avec Docker.

---

## Stack utilisée

| Couche       | Technologie                                       |
|--------------|---------------------------------------------------|
| Frontend     | Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/ui |
| Backend API  | NestJS (Node.js), Prisma ORM                      |
| Export       | Python (FastAPI), WeasyPrint, openpyxl, Jinja2    |
| Base de données | PostgreSQL                                      |
| Authentification | JWT (JSON Web Tokens) via Passport.js           |
| Déploiement  | Docker, Docker Compose                            |

---

## Prérequis

- **Docker** et **Docker Compose** installés sur la machine (développement et production).
- (Optionnel) Node.js 20+ et Python 3.10+ si vous souhaitez exécuter les services sans conteneurs.
- Un serveur PostgreSQL si vous ne le conteneurisez pas (mais Docker Compose le gère automatiquement).

---

## Installation (développement)

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-organisation/eglise-finance.git
   cd eglise-finance
   ```

2. **Configurer les variables d’environnement**
   Copiez le fichier d’exemple et ajustez les valeurs si nécessaire.
   ```bash
   cp .env.example .env
   ```
   Voir la section [Variables d’environnement](#variables-denvironnement).

3. **Lancer tous les services avec Docker Compose**
   ```bash
   docker compose up -d
   ```
   Cela démarre :
   - La base de données PostgreSQL
   - L’API NestJS (port 4000)
   - Le frontend Next.js (port 3000)
   - Le microservice Python d’export (port 5000)

4. **Exécuter les migrations Prisma et le seed (premier lancement)**
   ```bash
   docker compose exec api npx prisma migrate dev --name init
   docker compose exec api npx prisma db seed
   ```
   (Un utilisateur administrateur par défaut sera créé, voir le seed.)

5. **Accéder à l’application**
   - Frontend : [http://localhost:3000](http://localhost:3000)
   - API : [http://localhost:4000](http://localhost:4000)
   - Export service : [http://localhost:5000](http://localhost:5000)

---

## Variables d’environnement

Le fichier `.env` (ou `.env.local` pour le frontend) contient :

```env
# Base de données
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/eglise_finance?schema=public

# API NestJS
JWT_SECRET=changez-moi-par-une-clef-longue
API_PORT=4000

# Frontend Next.js
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_EXPORT_URL=http://localhost:5000

# Microservice export (Python)
EXPORT_SERVICE_PORT=5000
```

En production, adaptez les URLs et utilisez des secrets forts.

---

## Base de données

Le schéma est décrit dans `api/prisma/schema.prisma`.  
Les principales tables sont :

- `User` (administrateurs, gestionnaires, responsables de département)
- `Membre` (fidèles)
- `MembreFormConfig` (configuration du formulaire public)
- `Investisseur`, `VersementInvestisseur`
- `MouvementCaisse`
- `DepenseConstruction`
- `Department`, `MouvementDepartement`

Le champ `champsDynamiques` (JSON) de `Membre` et la configuration `MembreFormConfig.champs` permettent de stocker et gérer des formulaires personnalisés sans modifier la structure de la base.

---

## Lancement en développement

- **Frontend seul** (hot reload) :
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
  Le frontend sera disponible sur le port 3000.

- **Backend API seul** :
  ```bash
  cd api
  npm install
  npm run start:dev
  ```

- **Microservice Python** :
  ```bash
  cd export-service
  python -m venv venv
  source venv/bin/activate  # ou venv\Scripts\activate sur Windows
  pip install -r requirements.txt
  uvicorn main:app --reload --port 5000
  ```

Assurez-vous que PostgreSQL est accessible (localement ou via Docker) et que `DATABASE_URL` pointe sur la bonne instance.

---

## Déploiement (production)

1. **Construire les images Docker**
   ```bash
   docker compose -f docker-compose.prod.yml build
   ```

2. **Démarrer en mode détaché**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

3. **Appliquer les migrations (si nécessaire)**
   ```bash
   docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
   ```

4. **Configurer un reverse proxy** (Nginx, Traefik) pour exposer les ports 80/443 et gérer le SSL (Let's Encrypt).

L’application peut tourner sur un VPS modeste (2 Go de RAM, 50 Go disque) ou même sur un ordinateur local de l’église avec un réseau WiFi. Une PWA (version progressive) sera intégrée pour améliorer la consultation hors ligne.

---

## Services externes

Aucun service cloud payant n’est nécessaire.  
- **Stockage des exports** : disque local ou volume Docker.
- **Envoi de liens** : les liens publics sont simplement partagés par le gestionnaire (WhatsApp, email, etc.) ; pas besoin de service d’email automatique pour le MVP.

---

## Tests et qualité

- Tests unitaires et d’intégration pour l’API NestJS avec Jest.
- Tests du microservice Python avec pytest.
- Linting : ESLint + Prettier pour le frontend et l’API, Ruff pour Python.
- À terme, intégration continue (GitHub Actions) pour les builds et les tests.

---

## Roadmap / Évolutions futures

- [ ] Mode hors ligne complet (synchronisation via service worker et IndexedDB)
- [ ] Notifications WhatsApp/SMS pour les échéances des investisseurs
- [ ] Module de rapport mensuel automatique
- [ ] Gestion des promesses de dons (pledges) hors construction
- [ ] Application mobile légère (PWA améliorée)
- [ ] Support multi-églises (architecture multi-tenant)

---

## Contribuer

Les contributions sont bienvenues !  
Veuillez ouvrir une issue pour discuter de ce que vous souhaitez apporter, puis soumettre une pull request en suivant le guide de contribution (à venir).

---

## Licence

Ce projet est sous licence MIT. Vous êtes libre de l’utiliser, le modifier et le distribuer, y compris dans un cadre commercial.  
*Fait avec ❤️ pour les communautés chrétiennes d'Afrique.*

---

**Contact** : [votre-email@eglisefinance.org](mailto:votre-email@eglisefinance.org)  
*Projet en développement actif – version MVP attendue pour [mois/année]*.
```

Ce `README.md` donne toutes les clés pour comprendre le projet, l’installer et le déployer. Il est en français, détaillé et correspond exactement à la stack que nous avons définie (Next.js, NestJS, Python, PostgreSQL). Tu peux bien sûr adapter les liens, le nom du dépôt et les versions selon ton contexte.
