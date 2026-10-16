FOOTBALL ARENA — installation Netlify

FICHIERS
- index.html
- netlify.toml
- netlify/functions/matches.mjs

1. Déposez ces fichiers dans la racine du dépôt GitHub qui est connecté à Netlify.
   Le dossier netlify/functions doit rester exactement à cet emplacement.
2. Dans Netlify : Site configuration / Environment variables (ou Project configuration / Environment variables), ajoutez :
   Nom : FOOTBALL_DATA_API_KEY
   Valeur : votre clé Football-Data.org (gardez-la privée).
3. Déclenchez un nouveau déploiement après avoir enregistré la variable.
4. Testez : https://VOTRE-SITE.netlify.app/.netlify/functions/matches
   Vous devriez recevoir un objet JSON avec les matchs ou un message explicite si la clé/le forfait bloque l'accès.

SÉCURITÉ
- Ne mettez jamais la clé dans index.html ni dans GitHub.
- La clé est lue uniquement par la fonction Netlify côté serveur.
- Ne publiez pas la clé dans une capture d'écran ou un message public.

NOTES
- L'offre gratuite Football-Data.org ne couvre pas nécessairement les championnats algériens ou arabes.
- Les codes de compétitions sont filtrés dans la fonction pour empêcher de demander des URL arbitraires.
- Les emplacements publicitaires sont des espaces réservés. Pour diffuser des annonces, créez des unités dans AdSense et insérez le code d'unité fourni par Google dans les emplacements souhaités.
- Le lecteur vidéo n'accepte que des URL d'intégration HTTPS YouTube/Vimeo; utilisez uniquement des contenus dont la diffusion est autorisée.
