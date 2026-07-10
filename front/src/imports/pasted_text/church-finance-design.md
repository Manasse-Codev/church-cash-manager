Design a warm, trustworthy, and community-centered web application for managing church finances in Francophone Africa. The design must reflect African cultural identity while remaining highly usable on low-end smartphones and slow connections.

**Core Philosophy:**
- “Digital mbongui” (palaver tree) – a gathering space for transparency and trust.
- The interface must feel like a modern, clean community ledger, not a cold corporate tool.
- Simplicity first: every screen should be understandable by a church elder with basic smartphone experience.

**Visual Identity – African Inspired:**
- Color palette: 
  - Primary: warm terracotta (#C67B4B) – the color of African earth.
  - Secondary: deep gold (#D4A843) – symbolizing faith and value.
  - Accent: rich teal or dark green (#2F6B4E) – for positivity and growth.
  - Background: soft cream (#FDFAF3) with subtle texture like handmade paper or light kente/bogolan geometric pattern (very faint, almost watermark).
  - Text: dark brown/charcoal (#3A3226), never pure black.
- Typography: 
  - Headings: a rounded, friendly serif or display font reminiscent of African lettering (e.g., "Abril Fatface" style but legible). 
  - Body: clean sans-serif (Inter, Nunito, or system fonts) for readability on small screens.
- Shapes & Motifs: 
  - Cards and buttons with slightly rounded corners (12px) and subtle dashed or dotted borders inspired by woven patterns.
  - Icons: thin, elegant line icons with a touch of African symbolism (e.g., drum for department, open hands for offering, adinkra-inspired “Gye Nyame” subtly in logo area).
  - Decorative dividers: tiny repeating triangles or zigzag lines.
- Imagery: no photography, use simple, flat illustrations showing community (silhouettes of people in worship, hands contributing coins, buildings). Style: semi-abstract, earthy tones.

**Layout & Navigation:**
- Mobile-first design (over 70% of users will access via Android phones). 
- Bottom tab bar (mobile) with 5 icons: Home (Dashboard), Hands (Investors), Coins (Treasury), Building (Construction), People (Members).
- Desktop: left sidebar with same icons and labels. Both should have a warm gold accent on active item.
- Top bar: church name (configurable), notification bell, and small avatar.
- All content must fit comfortably on a 360px wide screen without horizontal scroll.

**Performance & Accessibility:**
- Components must be extremely lightweight (no heavy images, use CSS for patterns).
- High contrast text, minimum 16px body, large touch targets (48px+).
- Support offline caching indicators (a small “saved offline” badge when data is cached).
- All labels in French (e.g., “Tableau de bord”, “Investisseurs”, “Caisse”).

**Specific Screens to Design (mobile + desktop):**

1. **Login / Connexion**
   - Warm cream background with faint kente-inspired border pattern.
   - Church logo placeholder (cross or adinkra symbol).
   - Simple card with email and password, gold “Se connecter” button.
   - Footer: “Une application pour la gestion transparente de l'église.”

2. **Tableau de Bord (Dashboard)**
   - Greeting: “Bonjour, [Admin]” with date in French.
   - 4 stat cards with icons: Total offrandes, Fonds construction, Promesses en cours, Dépenses du mois. Each card has a tiny upward/downward trend arrow.
   - A simple bar chart (income vs expenses) in terracotta and teal.
   - Last 3 transactions listed below.
   - Floating action button (FAB) “+ Nouvelle entrée” in gold.

3. **Investisseurs (Pledges for Temple Construction)**
   - Sub-header: “Engagements pour la construction”.
   - Filter row: “Catégorie” dropdown, search by name.
   - Cards or table: each investor shown with name, category, pledged amount, paid, remaining (highlight remaining in gold if >0), a mini progress bar with African fabric pattern instead of flat color.
   - Tap to expand and see payment history.
   - Export buttons: “Exporter PDF” / “Exporter Excel” with small file icons.
   - Bottom sheet to add a payment (date, amount, method).

4. **Caisse de l'Église (General Treasury)**
   - Tabs: “Tout”, “Entrées”, “Sorties”.
   - List items: date, motif, amount in green (entrée) or red (sortie), recorded by.
   - Balance card at top with a subtle gold glow.
   - Button “+ Nouvelle transaction”.

5. **Dépenses Construction (Construction Expenses)**
   - Similar to caisse but dedicated, with a small icon of a church building.
   - Table: date, item, amount, supplier.
   - Total card “Total dépensé” with remaining budget if set.

6. **Départements (Departments)**
   - Grid of department cards: Chœur (choir), Jeunesse, Femmes, Enfants, etc. Each card has a small icon (drum, people, etc.), budget, spent, remaining bar.
   - Tap to open department ledger.
   - Admin can add department.

7. **Gestion des Membres (Members)**
   - Search and filter (name, category).
   - List with name, category badge (colored), phone, date.
   - “Générer un lien d'inscription” button that opens a modal to choose fields (dynamic form builder).
   - Show a preview of the public form and a shareable link with WhatsApp icon.

8. **Formulaire d'Inscription Public (Public Member Form)**
   - Clean mobile view with church header, dynamic fields (example: Nom, Prénom, Téléphone, Catégorie), all labels in French.
   - Gold submit button “S'inscrire”.
   - Success: “Bienvenue dans la famille !” with a small illustration of joined hands.

**Cultural Specifics:**
- Use French language, with possible future translation into local languages (leave space).
- Icons and illustrations should avoid western business metaphors (no briefcases, suits). Use African community symbols: hands together, talking drum, open Bible, baobab tree, woven basket.
- The overall feel should be like a modern “carnet de caisse” (cash book) but elevated with care and transparency.

Output a complete Figma design system with reusable components, auto-layout, responsive variants, and a style guide.