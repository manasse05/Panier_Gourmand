# Panier_Gourmand
# 🛒 FreshCorner — Site Vitrine & Boutique Alimentaire

> Site web complet pour PME alimentaire avec boutique publique et tableau de bord d'administration.  
> Développé par **TwinDev Agency** · Abidjan, Côte d'Ivoire

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Structure du projet](#-structure-du-projet)
- [Installation & lancement](#-installation--lancement)
- [Utilisation](#-utilisation)
- [Identifiants par défaut](#-identifiants-par-défaut)
- [Technologies utilisées](#-technologies-utilisées)
- [Auteur](#-auteur)

---

## 🌟 Présentation

**FreshCorner v1** est une solution web clé-en-main destinée aux boutiques et marchés alimentaires locaux.  
Elle permet au propriétaire de gérer son catalogue de produits, ses commandes et ses livraisons **sans aucune connaissance en code**, via un tableau de bord intuitif.

Le projet est composé de **5 fichiers** qui fonctionnent ensemble :

| Fichier | Rôle |
|---|---|
| `boutique.html` | Page publique vue par les clients |
| `boutique.css` | Styles de la boutique |
| `admin.html` | Tableau de bord du propriétaire |
| `admin.css` | Styles de l'administration |
| `app.js` | Toute la logique JavaScript partagée |

---

## ✅ Fonctionnalités

### 🌐 Boutique (côté client)

- Catalogue de produits avec filtres par catégorie et tri par prix
- Recherche de produits en temps réel
- Panier d'achat avec gestion des quantités
- Formulaire de commande (nom, téléphone, adresse, paiement)
- Commande rapide via **WhatsApp** (message pré-rempli automatique)
- Suivi de commande par numéro de téléphone
- Affichage des images uploadées par l'admin
- Ajout aux favoris ❤️
- Bouton **"Gérer la boutique"** discret pour accéder à l'admin

### ⚙️ Administration (côté propriétaire)

**Tableau de bord**
- Statistiques en temps réel (produits, commandes, chiffre d'affaires)
- Alertes de rupture de stock
- Aperçu des dernières commandes

**Gestion des produits**
- Ajouter, modifier, supprimer des produits
- Upload d'image depuis le PC ou par URL
- Choisir icône emoji, couleur de fond, badge (Nouveau / Promo / Populaire)
- Activer / désactiver le stock en un clic

**Gestion des commandes**
- Voir toutes les commandes avec détails client
- Changer le statut : En attente → Confirmée → En livraison → Livrée
- Recherche et filtrage par statut

**Livraisons**
- Vue dédiée aux commandes à expédier et en cours
- Numéro client cliquable pour appeler directement
- Marquer comme livrée en un clic

**Catégories**
- Ajouter et supprimer des catégories de produits

**Paramètres**
- Modifier le nom de la boutique, téléphone WhatsApp, adresse, horaires
- Modifier le texte de la bannière promo
- Changer les identifiants de connexion (login + mot de passe)

---

## 📁 Structure du projet

```
freshcorner-v1/
│
├── boutique.html      ← Page principale (clients)
├── boutique.css       ← Styles de la boutique
│
├── admin.html         ← Tableau de bord (propriétaire)
├── admin.css          ← Styles de l'administration
│
└── app.js             ← Logique JavaScript complète
```

> ⚠️ **Important** — Les 5 fichiers doivent toujours être dans le **même dossier**.  
> Ne les séparez jamais, sinon les liens entre eux cesseront de fonctionner.

---

## 🚀 Installation & lancement

### Option 1 — En local (démo, test)

1. Télécharger les 5 fichiers dans un même dossier
2. Ouvrir **VS Code** et installer l'extension **Live Server**
3. Clic droit sur `boutique.html` → **"Open with Live Server"**
4. Le site s'ouvre dans le navigateur à l'adresse `http://127.0.0.1:5500`

> ℹ️ Ne pas ouvrir les fichiers par double-clic direct — cela peut empêcher
> la connexion admin de fonctionner correctement (problème `file://`).
> Toujours utiliser **Live Server** ou un serveur local.

### Option 2 — En ligne (production, livraison client)

**Déploiement sur Netlify (gratuit, recommandé) :**

1. Créer un compte sur [netlify.com](https://netlify.com)
2. Cliquer sur **"Add new site"** → **"Deploy manually"**
3. Glisser-déposer le dossier contenant les 5 fichiers
4. Le site est en ligne en moins d'une minute avec une URL du type `monsite.netlify.app`

**Déploiement sur GitHub Pages :**

1. Créer un dépôt GitHub public
2. Uploader les 5 fichiers
3. Aller dans **Settings** → **Pages** → sélectionner la branche `main`
4. Le site est accessible à `https://username.github.io/nom-du-depot`

---

## 📖 Utilisation

### Accéder à l'administration

**Depuis la boutique :**
1. Aller sur `boutique.html`
2. Cliquer sur le bouton discret **"⚙️ Gérer la boutique"** en bas à droite
3. Entrer les identifiants
4. Vous êtes redirigé automatiquement vers `admin.html`

**Directement :**
1. Ouvrir `admin.html` dans le navigateur
2. Entrer les identifiants sur l'écran de connexion

### Ajouter un produit

1. Aller dans **Produits** dans le menu de gauche
2. Cliquer sur **"+ Ajouter un produit"**
3. Remplir le nom, la catégorie, le prix et l'unité (champs obligatoires)
4. Uploader une image ou coller une URL
5. Cliquer sur **"💾 Enregistrer"**

Le produit apparaît immédiatement sur la boutique.

### Gérer une commande

1. Aller dans **Commandes**
2. Changer le statut via le menu déroulant sur chaque carte
3. Pour les livraisons, aller dans **Livraisons** pour une vue dédiée

---

## 🔐 Identifiants par défaut

| Champ | Valeur |
|---|---|
| Identifiant | `admin` |
| Mot de passe | `1234` |

> ⚠️ Pensez à changer ces identifiants dès la première utilisation dans  
> **Administration → Paramètres → Identifiants de connexion**.

---

## 💾 Stockage des données

Les données (produits, commandes, paramètres) sont stockées dans le **`localStorage`** du navigateur.

**Ce que cela signifie pour le client :**
- ✅ Fonctionne sans serveur, sans base de données, sans abonnement
- ✅ Gratuit à héberger (Netlify, GitHub Pages)
- ⚠️ Les données sont liées au navigateur utilisé
- ⚠️ Si le client change de navigateur ou vide le cache, les données sont perdues

> Pour une solution avec base de données partagée entre plusieurs appareils,  
> une version v2 avec backend (Supabase) est disponible sur demande.

---

## 🛠 Technologies utilisées

| Technologie | Usage |
|---|---|
| HTML5 | Structure des pages |
| CSS3 | Styles, animations, responsive design |
| JavaScript ES6+ | Logique métier, gestion d'état |
| localStorage | Persistance des données |
| Google Fonts | Typographies (Syne, Nunito) |
| WhatsApp API | Commandes via messagerie |

Aucun framework, aucune dépendance externe, aucun serveur requis.

---

## 🎨 Palette de couleurs

| Couleur | Code | Usage |
|---|---|---|
| Vert principal | `#1e7c45` | Boutons, accents, sidebar admin |
| Orange | `#f5630a` | Prix, CTA, badges |
| Blanc | `#ffffff` | Fond des cartes |
| Gris doux | `#f9fbf9` | Fond des sections |

---

## 📱 Responsive

Le site est adapté pour :
- 🖥️ Desktop (1280px et plus)
- 💻 Laptop (1024px)
- 📱 Mobile (moins de 900px) — navigation simplifiée

---

## 🔄 Versions

| Version | Description |
|---|---|
| **v1.0** (actuelle) | Boutique + Admin complet, stockage localStorage |
| v2.0 (à venir) | Base de données Supabase, multi-appareils |

---

## 👨‍💻 Auteur

**TwinDev Agency**  
Agence de développement web · Abidjan, Côte d'Ivoire

| Contact | Info |
|---|---|
| Fondateurs | Manassé Doou Franc & Sow Boubakar |
| Spécialité | Sites vitrine, e-commerce, applications web pour PME |
| Localisation | Abidjan, Cocody |

---

*© 2025 TwinDev Agency — Tous droits réservés*
