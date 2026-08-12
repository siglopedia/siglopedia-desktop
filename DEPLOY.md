# Déployer le site SigloPedia — gratuitement

Ce dossier contient un site 100% statique (HTML/CSS/JS, aucun serveur
requis). Deux choses à héberger séparément :

1. **Le site vitrine** (ce dossier) → hébergement statique gratuit.
2. **L'installateur `SigloPedia-Setup.exe`** → GitHub Releases (gratuit,
   jusqu'à 2 Go par fichier).

## Option recommandée : GitHub Pages + GitHub Releases

### A. Créer le dépôt
1. Créez un compte sur [github.com](https://github.com) (gratuit).
2. Créez un nouveau dépôt **public**, par ex. `siglopedia-desktop`.
3. Mettez-y le code source de l'application (dossier `siglopedia_desktop/`)
   à la racine, et ce site dans un sous-dossier `docs/`.

### B. Publier le site (GitHub Pages)
1. Dans le dépôt : **Settings → Pages**.
2. Source : *Deploy from a branch*.
3. Branch : `main`, dossier `/docs`.
4. Enregistrez. Le site est en ligne en 1-2 minutes à l'adresse
   `https://VOTRE-PSEUDO.github.io/siglopedia-desktop/`.
5. (Optionnel) Domaine personnalisé : achetez un nom de domaine, ajoutez un
   fichier `CNAME` contenant ce domaine dans `docs/`, puis configurez un
   enregistrement DNS `CNAME` pointant vers `VOTRE-PSEUDO.github.io`.

### C. Publier l'installateur (GitHub Releases)
1. Compilez l'installateur **sur Windows** avec `CREER_INSTALLATEUR.bat`
   (nécessite Inno Setup, gratuit) — cela ne peut pas se faire sur Mac/Linux.
2. Dans le dépôt GitHub : **Releases → Draft a new release**.
3. Tag de version : `v1.1.0` (doit correspondre à `APP_VERSION` dans
   `app/version.py`).
4. Glissez `SigloPedia-Setup.exe` dans la zone de dépôt de fichiers.
5. Publiez la release.
6. Le bouton de téléchargement du site
   (`https://github.com/.../releases/latest/download/SigloPedia-Setup.exe`)
   fonctionnera alors automatiquement, sans jamais avoir besoin d'être
   modifié pour les futures versions.

### D. Relier la vérification de mise à jour intégrée à l'app
Dans `app/version.py`, mettez à jour :
```python
DEFAULT_UPDATE_FEED = "https://api.github.com/repos/VOTRE-PSEUDO/siglopedia-desktop/releases/latest"
```
avec votre vrai dépôt, pour que le bouton "Vérifier les mises à jour" dans
l'application fonctionne.

## Alternative tout aussi gratuite : Netlify / Vercel / Cloudflare Pages

Si vous préférez ne pas utiliser Git :
1. Créez un compte gratuit sur [netlify.com](https://netlify.com) (ou
   Vercel, ou Cloudflare Pages).
2. Glissez-déposez ce dossier entier dans l'interface ("Deploy manually" /
   drag-and-drop).
3. Le site est en ligne en quelques secondes, avec une URL `*.netlify.app`.
4. Un domaine personnalisé peut être ajouté gratuitement dans les
   paramètres du site.

L'installateur `.exe` reste hébergé sur GitHub Releases dans tous les cas
(Netlify/Vercel ne sont pas adaptés à héberger de gros fichiers binaires
gratuitement) — changez simplement le lien de téléchargement dans
`index.html` en conséquence.

## Avant de publier — liste de vérification

- [ ] Remplacer les `[À COMPLÉTER]` dans `mentions-legales.html` et
      `privacy.html` par vos vraies informations (obligatoire en France).
- [ ] Remplacer `contact@siglopedia.example.com` par une vraie adresse.
- [ ] Remplacer les liens `github.com/siglopedia/siglopedia-desktop` par
      l'URL de votre dépôt réel (recherchez ce texte dans tous les fichiers
      `.html`).
- [ ] Mettre à jour `<link rel="canonical">` et les balises
      `og:*` dans `index.html` avec l'URL réelle du site.
- [ ] Vérifier que `SigloPedia-Setup.exe` est bien publié dans une Release
      GitHub avant de partager le lien de téléchargement.
