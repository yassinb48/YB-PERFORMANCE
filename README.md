# YB Performance — Site v2

Site vitrine + vente des 2 programmes (12-16 ans / Adultes 17+) avec paiement Stripe.

## Structure (volontairement plate — un seul sous-dossier)
```
index.html                 Accueil
programmes.html             Catalogue (2 programmes)
programme-12-16.html        Page de vente 12-16 ans
programme-adultes.html      Page de vente Adultes 17+
contenu-12-16.html          Programme complet 12-16 ans (accès après achat)
contenu-adultes.html        Programme complet Adultes 17+ (accès après achat)
merci.html                  Page après paiement (redirige vers le bon contenu)
logo.png / coach-terrain.jpg / coach-frere.jpg   Images, à la racine
netlify/functions/create-checkout-session.js     Fonction Stripe (seul sous-dossier)
netlify.toml, package.json  Configuration
```

CSS et JS sont directement intégrés dans chaque page HTML (pas de fichiers `css/` ou `js/`
séparés) pour éviter tout problème de dossier lors de l'upload sur GitHub.

## Déploiement — voir les instructions envoyées avec ce fichier.

## Variables d'environnement Netlify (déjà configurées normalement)
- `STRIPE_SECRET_KEY` — ta clé secrète Stripe en mode Live.

## Test local du catalogue
Les IDs de produits envoyés à la fonction Stripe sont `12-16` (39€) et `adultes` (49€),
définis dans `netlify/functions/create-checkout-session.js`.
