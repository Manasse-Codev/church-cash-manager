1. Pourquoi cette stack et pas une autre ?
Vous avez explicitement écarté Laravel. La combinaison Next.js + NestJS + Python répond à plusieurs contraintes implicites :

Full-stack TypeScript : vous bénéficiez d’un typage fort de bout en bout (front et API), ce qui réduit considérablement les erreurs d’intégration et améliore la productivité.

Séparation claire des responsabilités : Next.js gère l’interface et le rendu, NestJS orchestre la logique métier et l’accès aux données, Python excelle dans la génération de documents (PDF/Excel) avec des bibliothèques matures.

Déploiement moderne et léger : des conteneurs Docker, une base PostgreSQL unique, le tout peut tourner sur un petit VPS sans licence.

Évolutivité : l’architecture modulaire de NestJS permet d’ajouter facilement des fonctionnalités sans tout casser.

Si on devait résumer : Next.js pour l’UX, NestJS pour la fiabilité métier, Python pour la qualité des exports, le tout orchestré par Docker.

2. Le Frontend – Next.js 14+ (App Router)
2.1. Choix de l’App Router
L’App Router (introduit dans Next.js 13 et stable en 14) apporte :

Le Server Components par défaut, qui allègent le JavaScript envoyé au navigateur et améliore les performances, crucial pour les zones à faible bande passante.

La possibilité de faire du SSR pour les pages publiques (formulaire d’inscription) afin d’être bien référencé et de charger rapidement le formulaire dynamique.

Une organisation par dossiers (/app/(auth)/dashboard, /app/inscription/[token]) très lisible.

2.2. UI et composants
Tailwind CSS : utilitaire, rapide, personnalisable. On évite les gros frameworks CSS, ce qui réduit la taille du bundle.

Shadcn/ui : collection de composants React accessibles, copiés dans votre projet (pas une dépendance lourde). Vous allez adorer leur DataTable avec tri, filtrage, pagination, et colonnes masquables. Idéal pour tous vos tableaux (investisseurs, mouvements de caisse, etc.).

TanStack Table (sous le capot de Shadcn/ui) : parfait pour les tableaux complexes avec export.

2.3. Gestion d’état et appels API
Pas besoin de Redux pour ce projet. On utilisera :

React Query (TanStack Query) pour toutes les données serveur (cache automatique, revalidation, gestion des états de chargement/erreur). Cela simplifie énormément le code.

Context API ou un simple état local pour l’authentification (stockage du token JWT, informations utilisateur).

Un api-client.ts basé sur fetch ou axios, configuré avec l’URL de base de l’API NestJS et un intercepteur qui attache le token JWT.

2.4. Authentification côté frontend
Le token JWT est stocké dans un cookie httpOnly (plus sécurisé contre XSS) si on utilise le SSR, ou dans le localStorage si on privilégie le CSR. Pour la simplicité, un cookie httpOnly est recommandé.

Next.js middleware pour protéger les routes /dashboard/* : vérifie la présence du cookie JWT côté serveur, redirige vers /login si absent.

2.5. PWA (Progressive Web App)
Avec next-pwa, on configure un service worker qui met en cache les pages principales. Ainsi, même sans connexion, l’utilisateur peut consulter le tableau de bord ou la liste des membres (données du cache). La saisie hors ligne est une évolution future (IndexedDB), mais la PWA simple apporte déjà une énorme valeur ajoutée en Afrique.

3. L’API Backend – NestJS + Prisma
3.1. Pourquoi NestJS ?
Architecture modulaire inspirée d’Angular : chaque domaine métier est un module (InvestisseurModule, CaisseModule, etc.). Cela force une structure propre, facile à maintenir.

Decorateurs, guards, intercepteurs : la gestion des rôles (@Roles(ADMIN)) et la validation des DTOs avec class-validator sont triviales.

Compatibilité parfaite avec Prisma : le PrismaService s’intègre comme un provider global.

Génération OpenAPI (Swagger) automatique, très pratique pour documenter l’API.

3.2. Prisma ORM
Type-safe : le client Prisma génère des types TypeScript à partir du schéma, donc zéro erreur de requête.

Migrations simples : npx prisma migrate dev crée le SQL. En production, prisma migrate deploy.

Relations et requêtes optimisées : pour récupérer un investisseur avec ses versements, un simple include: { versements: true } suffit.

Seed : permet de peupler la base avec un admin par défaut, des catégories, etc.

3.3. Structure d’un module type (ex : Investisseur)
text
src/investisseur/
├── investisseur.controller.ts   # Endpoints REST
├── investisseur.service.ts      # Logique métier (CRUD, calcul reste à payer)
├── dto/
│   ├── create-investisseur.dto.ts
│   └── investisseur-response.dto.ts
├── entities/                    # Facultatif, car Prisma gère les types
└── investisseur.module.ts
Le service utilise PrismaService injecté. Le contrôleur applique des guards JwtAuthGuard et RolesGuard.

3.4. Validation et transformation
DTOs avec class-validator : chaque endpoint reçoit un DTO décoré (@IsString(), @IsNumber(), etc.). Les erreurs sont renvoyées automatiquement avec un code 400.

Sérialisation : on utilise class-transformer pour exposer uniquement les champs souhaités (ex : ne jamais renvoyer le hash du mot de passe).

3.5. Gestion du lien public pour les membres
Le MembreModule expose un endpoint public POST /membres/public/:token sans authentification. Un guard spécifique vérifie que le token existe dans MembreFormConfig et que le formulaire est actif. Les données reçues sont validées dynamiquement en fonction de la configuration stockée en JSON.

4. Le Microservice Python (FastAPI)
4.1. Justification
WeasyPrint : convertit du HTML/CSS en PDF avec une fidélité remarquable (pieds de page, tableaux, logos). Incontournable pour des rapports financiers propres.

openpyxl : permet de créer des classeurs Excel avec plusieurs feuilles, formules de somme, bordures, couleurs, etc. Les trésoriers adorent.

Jinja2 : templates pour générer le HTML ou le XML Excel. Une maquette unique peut être réutilisée pour tous les exports.

4.2. Communication
Le service est appelé uniquement par l’API NestJS (réseau Docker interne). Le flux est le suivant :

L’utilisateur clique sur « Exporter (PDF) » dans le front.

Le front appelle GET /api/export/investisseurs/pdf (endpoint NestJS).

Le contrôleur Export de NestJS récupère les données depuis la DB, les formate, puis envoie une requête POST au microservice Python avec les données JSON et le type de template.

Python génère le fichier, l’enregistre temporairement (ou le renvoie en flux), et retourne l’URL ou le contenu.

NestJS relaie le fichier au frontend.

4.3. Sécurité
Le microservice est dans un réseau Docker isolé, non exposé publiquement. On peut ajouter un secret partagé entre NestJS et Python pour authentifier les appels internes.

5. Base de données – PostgreSQL
5.1. Pourquoi PostgreSQL plutôt que MySQL/MariaDB ?
Support JSON natif : idéal pour les champs dynamiques des membres.

Meilleure conformité SQL : les requêtes complexes (agrégations pour le tableau de bord) sont plus expressives.

MVCC (Multiversion Concurrency Control) : performances constantes même avec des lectures/écritures simultanées (bien que le volume reste faible).

Recommandé par Prisma : la communauté Prisma + PostgreSQL est très active, moins de surprises.

5.2. Indexation
Pour les filtres fréquents (nom, catégorie, date), on créera des index dans le schéma Prisma avec @@index. Par exemple, sur Investisseur.categorie et VersementInvestisseur.dateVersement.

5.3. Sauvegardes
Un simple cron job Docker qui exécute pg_dump et sauvegarde le fichier sur un volume ou un stockage externe (cloud gratuit comme Backblaze B2). Facile à mettre en place.

6. Développement au quotidien (DX)
Monorepo avec npm workspaces (optionnel) pour partager les types DTO entre front et API ? Pas indispensable au début, mais peut éviter la duplication des interfaces.

Linting & formatage : ESLint + Prettier pour tout le code TypeScript, Ruff pour Python. Config partagée.

Pre-commit hooks avec Husky pour valider le format et les tests avant chaque commit.

Tests : Jest pour l’API, React Testing Library pour le front, pytest pour le service d’export.

