# SITE WEB DE L'AE2I - S5.A.01

## Membres du projet 

- CAUSSE Claire
- CROCHARD Sébastien
- PAUGAM Lucas 
- SASSIOUI Ayoub 
- SCARDIGLI Carla

## Setup du projet

Pour installer et configurer le projet, suivez les étapes ci-dessous. Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine avant de commencer.

### Liens de gestion

 - Interface web : http://localhost:5000/  
 - interface phpmyadmin : http://localhost:8081/
 - interface swagger : http://localhost:5000/api/docs/
### Commande de Gestion

- **GESTION SERVEUR**

   - Build l'image et la démarre :
      ```bash
      make build
      ```
   - Démarrage des conteneurs en arrière-plan :
      ```bash
      make up
      ```

   - Arrête tous les conteneurs sans les supprimer :
      ```bash
      make stop
      ```
- **GESTION CLIENT**

   - Installer React :
      ```bash
      make react-setup
      ```

   - Démarrer React :
      ```bash
      make react-start
      ```
### Notes
- En cas de modification dans les dépendances ou dans la configuration, relancez `make build` pour reconstruire les images Docker.
- Assurez-vous d'avoir les conteneurs backend d'activés pour accéder aux appels API.

## Documents liés

### [Maquette figma](https://www.figma.com/design/x80YzZcoVC2Qx2L0ZgT2aO/SAE-24---AE2I?node-id=43-158&node-type=canvas&t=y4DsXELsRVwtlGte-0)
### [Feuille de temps](https://aixmarseilleuniversite-my.sharepoint.com/:x:/g/personal/carla_scardigli_etu_univ-amu_fr/ERtpidJU7spHitK705P1Bq0BT9ysD6PX0hmqfjG1zhkiaQ?e=iQd0PO)
### [Jira](https://etu-team-xb10g8oo.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog?assignee=6421a5cbb05b4e3e7dab54f0&cloudId=6b58b1ab-5b5d-4bee-aa56-26dc49d68e7c&atlOrigin=eyJwIjoiaiIsImkiOiIxZTQyY2JkMzkxYTE0ZTUzYTNiNzlkNzlkMGE0MDVhZSJ9)


