# Générateur de diagramme D2 depuis des fichiers JSON Schema

## 📁 Structure attendue

Placez tous vos fichiers `.json` dans un dossier `schemas/`.

## ▶️ Exécution

1. Assurez-vous d'avoir Node.js installé.

  Il faut faire c'est 2 commandes : 

  1. npm init -y

  2. npm i fs

2. Exécutez le script :

```bash
node generate_d2.js
```

Cela va :
- Lire tous les fichiers JSON dans le dossier `schemas`
- Résoudre les `$ref` locaux entre fichiers
- Générer un diagramme `output.d2` avec les relations

## 💡 Astuce

Vous pouvez copier/coller `output.d2` dans [https://play.d2lang.com](https://play.d2lang.com) pour visualiser le diagramme.
