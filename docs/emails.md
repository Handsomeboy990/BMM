# Emails

Deux mécanismes complémentaires.

## 1. Emails transactionnels (EmailJS)

Envoyés par le backend via l'API REST d'EmailJS. Best-effort : si la
configuration est absente, l'action n'échoue pas — un log de simulation est
émis.

### Variables d'environnement

```
EMAILJS_SERVICE_ID=...
EMAILJS_PUBLIC_KEY=...
EMAILJS_PRIVATE_KEY=...
EMAILJS_TEMPLATE_ID=...            # gabarit générique (campagnes)
EMAILJS_WELCOME_TEMPLATE_ID=...    # gabarit de bienvenue donneur (optionnel)
```

Si `EMAILJS_WELCOME_TEMPLATE_ID` n'est pas défini, l'email de bienvenue
retombe sur `EMAILJS_TEMPLATE_ID`.

### Gabarit « Bienvenue donneur »

À créer dans le dashboard EmailJS. Variables disponibles (`template_params`) :

| Variable     | Contenu                                         |
| ------------ | ----------------------------------------------- |
| `to_email`   | Email du donneur                                |
| `to_name`    | Nom complet                                     |
| `blood_type` | Groupe sanguin                                  |
| `city`       | Ville                                           |
| `verify_url` | Lien vers la preuve d'intégrité (`/verify/:id`) |

> ⚠️ **Ne jamais** inclure la clé privée du donneur dans un email. Elle est
> générée dans le navigateur, jamais transmise au serveur ; le donneur la
> copie ou la télécharge depuis l'écran de confirmation.

Déclenché dans `POST /api/v1/donors` (après création du profil).

## 2. Confirmation d'email (Supabase, natif)

La confirmation d'adresse est gérée par Supabase Auth, pas par le code.

- **Activer** : Dashboard Supabase → Authentication → Providers → Email →
  **Confirm email**.
- Personnaliser le contenu : Authentication → Email Templates → _Confirm
  signup_.
- Définir l'URL de redirection : Authentication → URL Configuration →
  **Site URL** (ex. `https://…/` ou `http://localhost:3000`).

Avec la confirmation activée, un donneur (ou une structure) doit confirmer
son email avant de pouvoir **se connecter**. L'inscription (création du
profil) fonctionne dans tous les cas.

> En développement, laisser « Confirm email » désactivé évite les limites
> d'envoi d'emails de Supabase et les blocages de connexion.
