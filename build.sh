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
