# Utiliser une image Python
FROM python:3.11-slim

# Installer les dépendances
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libssl-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY app/requirements.txt /app/requirements.txt

# Installer les bibliothèques Python
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copier le code de l'application
COPY app /app

# Exposer le port de Flask
EXPOSE 5000

# Commande par défaut
CMD ["python", "run.py"]
