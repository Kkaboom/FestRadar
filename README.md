# EventTrack

EventTrack est un radar personnel d'événements électroniques orienté techno / rave / club culture. Il agrège automatiquement des événements depuis des sources publiques sans modèle IA en production.

## V2

- UI sombre, responsive et animée.
- Filtres directs par format : festival, club night, rave / warehouse, open air / parade, privé / secret, afterparty.
- Filtres par genre : techno, hard techno, house, trance, hardcore, drum & bass, psytrance, industrial / acid.
- Filtrage automatique des contenus hors cible (rap / hip-hop, classique, opéra, théâtre, stand-up, etc.).
- Recherche par événement, ville, lieu et genre.
- Panneau admin protégé par mot de passe.
- Ajout / suppression de sources et ajout manuel d'événements.
- Extraction JSON-LD `schema.org/Event`, ICS et RSS / Atom.
- Exploration limitée des fiches événement liées depuis une page d'agenda.
- Déduplication et score de confiance.
- Collecteur automatique planifié + déclenchement manuel en tâche de fond.
- Source globale StungEvents sans clé.
- Connecteur Ticketmaster optionnel avec `TICKETMASTER_API_KEY`.
- Stockage persistant via Netlify Blobs.

## Déploiement Netlify

Le dépôt contient déjà `netlify.toml` :

- `publish = "public"`
- `functions = "netlify/functions"`

Variables requises :

- `ADMIN_PASSWORD` : mot de passe du panneau admin.
- `SESSION_SECRET` : chaîne aléatoire longue (32 caractères minimum).

Variable facultative :

- `TICKETMASTER_API_KEY` : active l'agrégation Ticketmaster Discovery API.

Le site public est `/` et l'administration `/admin.html`.

## Sources

Les sources les plus fiables sont les API publiques, pages HTML avec JSON-LD `Event`, calendriers ICS et flux RSS/Atom. Les sites fortement rendus en JavaScript, derrière login ou protections anti-bot peuvent ne rien exposer au collecteur. EventTrack ne contourne pas ces protections.

## Sécurité

- Les secrets restent côté serveur dans Netlify.
- Session admin signée avec cookie HttpOnly / SameSite=Strict.
- Validation d'URL et blocage des adresses locales / privées pour réduire le risque SSRF.
- Le scraper suit seulement un nombre limité de liens internes candidats par source.

## Structure

- `public/` : frontend public + administration.
- `netlify/functions/` : endpoints Netlify.
- `netlify/functions/_lib/` : auth, stockage, collecte, normalisation et découverte.
