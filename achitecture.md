

## Architecture globale

L’application adopte une architecture **microservices légère** conteneurisée, avec un frontend unique, une API principale et un service d’export séparé.

```
+-------------------+       +-------------------+       +-------------------+
|   Navigateur      | <-->  |   Next.js (SSR)   | <-->  |   NestJS (API)    |
| (PWA possible)    |       |   Port 3000       |       |   Port 4000       |
+-------------------+       +-------------------+       +-------------------+
                                                               |
                                                               | Prisma
                                                               v
                                                      +-------------------+
                                                      |   PostgreSQL      |
                                                      +-------------------+
                                                               ^
                                                               |
                                                      +-------------------+
                                                      | Python (FastAPI)  |
                                                      | Exports PDF/Excel |
                                                      | Port 5000 (interne)|
                                                      +-------------------+
```

- **Frontend Next.js** : rendu côté serveur (SSR) pour les pages publiques (formulaires membres) et client-side rendering pour le dashboard authentifié. Utilise Tailwind CSS + Shadcn/ui pour les composants.
- **API NestJS** : backend RESTful découpé en modules métier. Gère l’authentification JWT, les autorisations et orchestre les appels à la base de données via Prisma.
- **Service Python** : appelé en interne par l’API pour générer des PDF (WeasyPrint) et des fichiers Excel complexes (openpyxl) à partir de templates Jinja2. Il ne communique pas directement avec le frontend.
- **Base de données** : PostgreSQL unique, partagée par l’API (via Prisma) et le service Python (si besoin en lecture seule, mais surtout pour les exports lourds, il reçoit les données directement de l’API).

---

## Organisation du monorepo

```
eglise-finance/
├── frontend/                # Application Next.js
│   ├── app/                 # Routes (App Router)
│   │   ├── (auth)/          # Pages authentifiées (dashboard, modules)
│   │   ├── inscription/[token]/ # Page publique formulaire membre
│   │   └── layout.tsx
│   ├── components/          # Composants réutilisables (DataTable, ExportButton...)
│   ├── lib/                 # Utilitaires (API client, hooks)
│   ├── public/              # Assets statiques
│   └── ...
├── api/                     # Application NestJS
│   ├── prisma/              # Schéma Prisma, migrations
│   ├── src/
│   │   ├── auth/            # Module d'authentification (JWT, stratégie)
│   │   ├── dashboard/       # Module tableau de bord
│   │   ├── investisseur/    # Module investisseurs + versements
│   │   ├── caisse/          # Module caisse générale
│   │   ├── construction/    # Module dépenses construction
│   │   ├── departement/     # Module départements
│   │   ├── membre/          # Module membres + configuration formulaire
│   │   ├── export/          # Module intermédiaire pour appeler le service Python
│   │   ├── common/          # Guards, décorateurs, DTOs génériques
│   │   └── main.ts
│   └── ...
├── export-service/          # Microservice Python
│   ├── app/
│   │   ├── templates/       # Templates HTML/Excel
│   │   ├── routers/         # Endpoints FastAPI
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
└── README.md
```

Chaque service possède son propre `Dockerfile` pour la production.

---

## Détail des modules NestJS

L’API est structurée en modules indépendants, chacun encapsulant ses contrôleurs, services et DTOs.

| Module          | Contrôleur(s) principaux       | Responsabilité                                                                 |
|-----------------|--------------------------------|--------------------------------------------------------------------------------|
| AuthModule      | `AuthController`               | Inscription, connexion, renvoi de tokens JWT. Utilise Passport local et JWT.   |
| DashboardModule | `DashboardController`          | Agrégation des données pour les indicateurs (soldes, totaux, graphiques).       |
| InvestisseurModule | `InvestisseurController`, `VersementController` | CRUD investisseurs, versements, calcul du reste à payer, filtres. |
| CaisseModule    | `MouvementCaisseController`    | CRUD des entrées/sorties générales.                                             |
| ConstructionModule | `DepenseConstructionController`| CRUD des dépenses de chantier.                                                  |
| DepartementModule | `DepartementController`, `MouvementDepartementController` | Gestion des départements et de leurs mouvements. |
| MembreModule    | `MembreController`, `FormConfigController` | CRUD membres, configuration du formulaire, endpoint public pour inscription. |
| ExportModule    | `ExportController`             | Reçoit les requêtes d’export, construit les données et appelle le service Python. |

Chaque module déclare les entités Prisma nécessaires, les guards de rôles (`@Roles(Role.ADMIN)`) et les décorateurs personnalisés.

### Exemple de flux : Calcul du reste à payer d’un investisseur
1. Frontend appelle `GET /investisseurs` avec `include=versements`.
2. Le service `InvestisseurService` récupère l’investisseur et sa liste de versements.
3. Dans le DTO de réponse, on ajoute un champ calculé `resteAPayer = engagementMontant - somme(versements)`.
4. Le frontend affiche directement cette valeur dans le tableau.

---

## Authentification et autorisations

- **Authentification** : JWT stateless. Le frontend stocke le token dans un cookie httpOnly ou le localStorage. L’API valide le token via `JwtAuthGuard`.
- **Autorisations** : Utilisation des rôles (`ADMIN`, `GESTIONNAIRE`, `DEPARTEMENT`). Les routes départementales vérifient que l’utilisateur appartient au département concerné.
- **Rafraîchissement** : JWT à courte durée (ex : 1h) + refresh token (optionnel, stocké en base) pour plus de sécurité.

---

## Gestion des formulaires publics dynamiques

1. Un administrateur crée/modifie la configuration via `POST /membre-form-config`. Le corps contient un tableau JSON décrivant les champs (nom, type, requis, options).
2. Le backend génère un token unique `linkToken` et le stocke avec la config.
3. Le lien généré : `https://domaine/inscription/<linkToken>`. Côté Next.js, la route publique récupère la config via l’API (`GET /membre-form-config/public/<token>`) et construit dynamiquement le formulaire avec React Hook Form.
4. À la soumission, les données sont envoyées à `POST /membres/public` avec le token. Le backend enregistre un nouveau `Membre` en stockant les champs dynamiques dans la colonne `champsDynamiques` (JSON). Aucune authentification requise.

---

## Service d’export (Python)

**Justification** : WeasyPrint produit des PDF de qualité supérieure à partir de HTML/CSS, openpyxl gère les fichiers Excel complexes avec plusieurs feuilles, formules et styles. Node.js ne dispose pas d’équivalents aussi robustes.

- **Déclenchement** : l’API NestJS envoie une requête HTTP POST à `http://export-service:5000/generate` avec un payload JSON contenant les données à exporter, le type (`pdf` ou `excel`) et le template souhaité.
- **Génération** : le service utilise un template Jinja2 (pour le HTML) ou un script openpyxl prédéfini.
- **Réponse** : le fichier est généré en mémoire ou sauvegardé temporairement. Le service renvoie l’URL de téléchargement ou le flux binaire directement à l’API, qui le relaie au frontend.
- **Sécurité** : le service est interne au réseau Docker, non exposé publiquement.

---

## Base de données et accès concurrents

PostgreSQL a été choisi pour :
- Sa robustesse et son respect ACID (important pour la comptabilité).
- Son support natif du JSON pour les champs dynamiques des membres.
- Sa compatibilité parfaite avec Prisma ORM.
- Sa capacité à fonctionner avec peu de ressources (quelques Mo en idle).

Les migrations sont gérées par Prisma (`prisma migrate`). Un seed initial crée un utilisateur admin et quelques catégories.

---

## Déploiement avec Docker Compose

Le fichier `docker-compose.yml` définit quatre services :

```yaml
services:
  postgres:
    image: postgres:16-alpine
    volumes: [pgdata:/var/lib/postgresql/data]
    environment: ...
  api:
    build: ./api
    depends_on: [postgres]
    ports: ["4000:4000"]
    environment: ...
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment: ...
  export-service:
    build: ./export-service
    ports: ["5000:5000"]
```

En production, on peut ajouter Nginx comme reverse proxy et pour servir les assets statiques.

---

## Considérations hors ligne (PWA)

Le frontend sera configuré en PWA avec `next-pwa` pour :
- Mettre en cache les pages principales (dashboard, listes).
- Permettre une consultation des données même sans connexion (données en cache, pas de synchronisation d’écriture pour le MVP).
- Offrir une expérience “app-like” sur mobile, cruciale dans les zones à connexion intermittente.

---

## Sécurité

- Tous les appels API sensibles nécessitent un JWT valide.
- Validation stricte des entrées (class-validator dans NestJS).
- Protection CSRF (via token) pour les formulaires.
- Hash des mots de passe (bcrypt).
- Le service Python n’est pas exposé publiquement.
- Rate limiting sur les endpoints publics (formulaire membre).

---

## Tests et qualité

- **API NestJS** : tests unitaires (Jest) pour les services et contrôleurs.
- **Frontend** : tests de composants avec React Testing Library.
- **Export service** : tests avec pytest.
- Intégration continue via GitHub Actions pour lint, tests et build.

---

