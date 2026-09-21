<!-- BEGIN:nextjs-agent-rules -->

# AGENTS.md

## Objet du projet

Barpat Jeux est une plateforme francophone de jeux de lettres, familiale et accessible.

L’application doit être :

- chaleureuse et vivante ;
- utilisable par des joueurs de tous âges ;
- soignée sans être infantile ;
- animée avec mesure ;
- simple à comprendre sur mobile comme sur ordinateur.

Les premiers jeux prévus sont :

- Le Mot ;
- Motus ;
- Le Pendu.

Le projet commence volontairement avec une architecture simple. Les abstractions communes doivent apparaître à partir de besoins réels, pas de jeux hypothétiques.

---

## Priorité des instructions

Pour chaque mission :

1. suivre la demande explicite de l’utilisateur ;
2. respecter ce fichier ;
3. préserver les conventions déjà présentes dans le code.

Si une demande contredit une règle de ce fichier, appliquer la demande et signaler brièvement le changement de direction.

Ne pas élargir spontanément le périmètre d’une mission.

---

## Stack technique

Le projet utilise :

- Next.js avec App Router ;
- React ;
- TypeScript ;
- Tailwind CSS ;
- ESLint ;
- `next-themes` pour les thèmes.

Respecter le gestionnaire de paquets et les scripts déjà présents dans le dépôt.

Ne pas ajouter de dépendance sans nécessité réelle.

Ne pas utiliser shadcn dans ce projet.

Ne pas ajouter spontanément :

- de base de données ;
- d’authentification ;
- de gestionnaire d’état global ;
- de bibliothèque d’animations ;
- de bibliothèque de composants ;
- de PWA ;
- de service externe.

Ces éléments seront ajoutés uniquement lorsqu’une mission les demandera explicitement.

---

## Principes d’architecture

Privilégier :

- les composants lisibles ;
- les responsabilités claires ;
- les fonctions pures pour la logique métier ;
- la composition plutôt que les abstractions génériques ;
- le code local à une fonctionnalité tant qu’il n’est pas réellement partagé.

Éviter :

- les moteurs de jeu universels ;
- les stores globaux sans besoin démontré ;
- les couches de services vides ;
- les interfaces génériques créées pour un seul usage ;
- les fichiers `utils` servant de fourre-tout ;
- la duplication de règles métier importantes.

Le deuxième usage réel d’un comportement commun doit confirmer l’abstraction.

Une duplication légère et temporaire est préférable à une mauvaise abstraction durable.

---

## Organisation du projet

Les routes des jeux suivent cette convention :

```text
app/
└── jeux/
    ├── le-mot/
    ├── motus/
    └── le-pendu/
<!-- END:nextjs-agent-rules -->
