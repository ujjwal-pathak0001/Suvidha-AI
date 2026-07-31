#!/usr/bin/env bash
# Render Build Script for Suvidha-AI
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Download NLTK data
python -m nltk.downloader punkt punkt_tab stopwords averaged_perceptron_tagger averaged_perceptron_tagger_eng wordnet omw-1.4

# Collect static files (copies assets/ → staticfiles/)
python manage.py collectstatic --noinput

# Run database migrations
python manage.py migrate --noinput

# Auto-create admin superuser account if not already exists
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'A2SL.settings')
django.setup()
from django.contrib.auth.models import User
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'AdminSuvidha2024!')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@suvidha.ai')
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f'Superuser {username} created successfully.')
else:
    print(f'Superuser {username} already exists.')
"

