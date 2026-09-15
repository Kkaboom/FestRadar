# FestRadar

Petite WebApp personnelle pour agréger automatiquement des fêtes, parades, carnavals, festivals et autres événements à partir de sources ajoutées depuis un panneau admin.

## Ce que fait la V1

- Front public avec recherche, filtres pays/catégorie/date et tri chronologique.
- Panneau admin protégé par mot de passe.
- Ajout/suppression de sources directement depuis l'admin.
- Ajout manuel d'événements.
- Extraction automatique :
  - `schema.org/Event` / JSON-LD dans les pages HTML ;
  - calendriers `.ics` / iCalendar ;
  - flux RSS/Atom orientés événements (support basique).
- Dédoublonnage des événements.
- Score de confiance.
- Scraping manuel en tâche de fond.
- Scraping automatique toutes les heures, par lots, avec rotation des sources.
- Stockage persistant dans Netlify Blobs.
- Aucun modèle IA, aucune API OpenAI/Claude.

## Déploiement Netlify

1. Mets ce dossier dans un dépôt GitHub.
2. Dans Netlify : **Add new project > Import an existing project > GitHub**.
3. Netlify détectera `netlify.toml`.
4. Ajoute deux variables d'environnement :
   - `ADMIN_PASSWORD` : ton mot de passe admin.
   - `SESSION_SECRET` : une longue chaîne aléatoire d'au moins 32 caractères.
5. Déploie.
6. Ouvre `https://ton-site.netlify.app/admin.html`.

Le site public est à la racine `/`.

## Important sur les sources

Tous les sites ne sont pas facilement exploitables automatiquement. Le meilleur cas est un site qui publie ses événements en JSON-LD (`schema.org/Event`) ou en calendrier ICS. Pour un site fortement rendu en JavaScript, protégé par anti-bot ou sans données structurées, la V1 peut ne rien extraire. Tu peux alors garder la source enregistrée et ajouter l'événement manuellement.

## Sécurité

- Le mot de passe admin reste côté serveur dans les variables Netlify.
- Le navigateur reçoit seulement un cookie de session signé, HttpOnly et SameSite=Strict.
- Le scraper refuse les URL locales/privées les plus évidentes afin de limiter les risques SSRF.

## Structure

- `public/` : interface publique + admin.
- `netlify/functions/` : API et collecteur.
- `netlify/functions/_lib/` : stockage, auth, normalisation et scraping.

## Idées V2

- Sources globales sans clé : calendriers publics, Wikidata, certains flux touristiques.
- Connecteur Ticketmaster facultatif.
- Carte interactive.
- Favoris.
- Notifications "nouvelle fête trouvée".
- Détection plus avancée des pages qui n'utilisent pas JSON-LD.
- Historique des changements de date/lieu.
